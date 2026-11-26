import { readFileSync } from 'node:fs';

import { expect, test } from '@jest/globals';
import { buildSchema, parse, print, validate } from 'graphql';

import { order, orders } from '@/graphql/queries';

const schema = buildSchema(readFileSync('schema.graphql', 'utf8'));

function parseDocument(document: { toString(): string }) {
  const parsed = parse(document.toString());
  expect(validate(schema, parsed)).toEqual([]);
  return parsed;
}

test('주문 목록을 조회하면 nullable 필터와 주문 항목, nextCursor를 요청한다', () => {
  expect(print(parseDocument(orders))).toBe(`query orders($cursor: String, $size: Int, $statuses: [OrderStatus!]) {
  orders(cursor: $cursor, size: $size, statuses: $statuses) {
    items {
      id
      amount
      createdAt
      orderNumber
      paidAt
      prefixOrderNumber
      request
      status
      storeId
      storeName
      items {
        id
        price
        productId
        productName
        quantity
        skuId
        skuName
      }
    }
    nextCursor
  }
}`);
});

test('주문 상세를 조회하면 id로 목록과 같은 주문 정보를 요청한다', () => {
  expect(print(parseDocument(order))).toBe(`query order($id: ID!) {
  order(id: $id) {
    id
    amount
    createdAt
    orderNumber
    paidAt
    prefixOrderNumber
    request
    status
    storeId
    storeName
    items {
      id
      price
      productId
      productName
      quantity
      skuId
      skuName
    }
  }
}`);
});
