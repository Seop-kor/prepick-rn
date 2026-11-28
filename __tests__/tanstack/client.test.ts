import { afterEach, expect, jest, test } from '@jest/globals';

import { queryClient } from '@/tanstack/client';

// axios 오류는 요청 config(Authorization 헤더, refresh token 본문)를 함께 들고 있다
const error = Object.assign(new Error('Request failed with status code 500'), {
  config: { headers: { Authorization: 'Bearer secret-token' } }
});

afterEach(() => {
  jest.restoreAllMocks();
  queryClient.clear();
});

test('쿼리가 실패하면 요청 정보 없이 오류 메시지만 기록한다', async () => {
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

  await queryClient.fetchQuery({ queryKey: ['failing'], queryFn: () => Promise.reject(error) }).catch(() => {});

  expect(warn).toHaveBeenCalledWith('Request failed with status code 500');
  expect(warn).not.toHaveBeenCalledWith(error);
});

test('뮤테이션이 실패하면 요청 정보 없이 오류 메시지만 기록한다', async () => {
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

  await queryClient
    .getMutationCache()
    .build(queryClient, { mutationFn: () => Promise.reject(error), gcTime: 0 })
    .execute(undefined)
    .catch(() => {});

  expect(warn).toHaveBeenCalledWith('Request failed with status code 500');
  expect(warn).not.toHaveBeenCalledWith(error);
});
