# Auth API 연동 설계

작성일: 2026-10-10

## 목표

기존 auth UI(로그인, 회원가입)에 GraphQL mutation 4개를 연결한다.

- `login`: 로그인
- `sendSignupOtp`: 인증번호 문자 발송
- `verifySignupOtp`: 인증번호 검증, `verificationToken` 발급
- `signUp`: 회원가입. 응답에 `accessToken`, `refreshToken`이 있어 별도 로그인 없이 바로 로그인된다.

약관동의는 API가 없어 TODO로 남긴다.

## 구조

| 파일 | 역할 |
|---|---|
| `src/graphql/mutations.ts` | `sendSignupOtp`, `verifySignupOtp`, `signUp` document 추가 후 `yarn codegen` |
| `src/service/api.ts` | `login`, `sendSignupOtp`, `verifySignupOtp`, `signUp` 메서드. 모두 `skipAuth: true`, phone은 `toDigits`로 숫자만 전송 |
| `src/service/client.ts` | `GraphQLError`에 `code` getter (`errors[0].extensions?.code`) |
| `src/tanstack/mutations.ts` | `API.xxx`를 호출하는 함수. 에러 로그는 `MutationCache onError`가 담당하므로 따로 찍지 않음 |
| `src/tanstack/queries.ts` | query 호출 함수. 현재 비어 있음 |
| `src/tanstack/hooks.ts` | `useLogin`, `useSendSignupOtp`, `useVerifySignupOtp`, `useSignUp`. `useLogin`은 `onSuccess`에서 `setTokens` |
| `src/components/(auth)/AuthForm.tsx` | `button.isLoading` 추가 (rneui `Button`의 `loading`) |
| `src/components/(auth)/signup/OtpInput.tsx` | 하드코딩 상수 대신 `expiresAt`, `retryAt`(ms) prop. `error` prop 추가 |
| `src/app/(auth)/login/index.tsx` | `useLogin` 연결 |
| `src/app/(auth)/signup/index.tsx` | 회원가입 mutation 3개 연결 |
| `src/app/(auth)/(modal)/terms.tsx` | `// TODO: 약관동의 API 연동` |

## 흐름

### 로그인

`login` 성공 시 `setTokens`를 호출한다. `Stack.Protected` 가드가 바뀌어 홈으로 이동한다.

### 회원가입

1. 번호 단계: `sendSignupOtp`가 성공해야 otp 단계로 넘어간다.
2. otp 단계: 6자리가 입력되면 `verifySignupOtp`를 호출한다.
   - 성공하면 비밀번호 단계로 넘어간다.
   - 실패하면 입력을 유지하고 에러 문구를 보여준다. 코드를 고치면 `reset()`으로 에러를 지우고, 다시 6자리가 되면 재검증한다.
3. 비밀번호 단계: `signUp` 성공 시 done 화면으로 간다.
4. done 화면: "시작하기"를 누르면 `setTokens`를 호출한다.
   - `signUp` 직후 저장하면 가드가 바로 바뀌어 done 화면이 뜨기 전에 auth 스택이 사라진다. 그래서 저장을 이 시점까지 미룬다.

이름 필드에 `maxLength={50}`을 둔다 (서버 규칙: trim 후 1~50자).

### 응답 값 보관

별도 state 없이 `useMutation`의 `data`를 사용한다.

| 값 | 출처 |
|---|---|
| OTP 만료 시각 | `sendOtp.data.expiresAt` |
| 재요청 가능 시각 | `sendOtp.submittedAt + retryAfterSeconds * 1000` (`retryAfterSeconds`는 상대값) |
| `verificationToken` | `verify.data.verificationToken` |
| 로그인 토큰 | `signUp.data` |

재전송 요청 중이거나 재전송이 실패하면 `data`는 `undefined`다. 그동안 타이머는 숨기고 입력은 허용한다. 이전 인증번호가 서버에서 아직 유효할 수 있기 때문이다.

## 에러 처리

`GraphQLError.code`(`extensions.code`)로 분기한다.

| 상황 | code | 표시 위치 | 문구 |
|---|---|---|---|
| 로그인 실패 | `UNAUTHENTICATED` | 비밀번호 필드 | 휴대폰 번호 또는 비밀번호가 맞지 않아요. |
| 이미 가입된 번호 (발송) | `PHONE_NUMBER_ALREADY_REGISTERED` | 번호 필드 | 이미 가입된 번호예요. |
| 재요청 대기 (`retryAfterSeconds` 있음) | `TOO_MANY_REQUESTS` | 번호 필드 / otp 영역 | N초 후에 다시 요청해주세요. |
| 1시간 5회 초과 | `TOO_MANY_REQUESTS` | 번호 필드 / otp 영역 | 요청 횟수를 초과했어요. 잠시 후 다시 시도해주세요. |
| OTP 실패 | `BAD_USER_INPUT` | otp 영역 | 인증번호가 올바르지 않아요. 계속 실패하면 다시 받아주세요. |
| 인증 만료 (signUp) | `BAD_USER_INPUT` | Alert | 인증이 만료됐어요. 다시 인증해주세요. 이후 번호 단계로 이동 |
| 이미 가입된 번호 (signUp) | `PHONE_NUMBER_ALREADY_REGISTERED` | 번호 필드 | 이미 가입된 번호예요. 이후 번호 단계로 이동 |
| 그 외 (500, SMS 실패 503, 네트워크) | - | Alert | 잠시 후 다시 시도해주세요. |

- OTP 불일치, 만료, 5회 초과는 서버 응답이 같아 구분하지 않는다.
- SMS 발송 실패는 전용 code가 없다. 서버가 `SERVICE_UNAVAILABLE`을 내려주면 분기를 추가한다.

## 범위 밖

- 약관동의 API
- `user` 객체, `refreshTokenExpiresAt` 저장: 프로필 화면이 생길 때 추가

## 검증

테스트 러너가 없어 `tsc --noEmit`, `yarn lint`, 시뮬레이터 수동 확인으로 검증한다.
