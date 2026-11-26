import { graphql } from './__generated__';
import type { OrdersQuery, PromotionsQuery, StoresQuery } from './__generated__/graphql';

export type Store = StoresQuery['stores']['items'][number];
export type Promotion = PromotionsQuery['promotions'][number];
export type Order = OrdersQuery['orders']['items'][number];

export const healthCheck = graphql(`
  query healthCheck {
    healthCheck
  }
`);

export const currentUser = graphql(`
  query currentUser {
    currentUser {
      id
      name
    }
  }
`);

export const promotions = graphql(`
  query promotions {
    promotions {
      id
      title
      description
      imageUrl
    }
  }
`);

export const stores = graphql(`
  query stores($latitude: Float!, $longitude: Float!, $size: Int) {
    stores(latitude: $latitude, longitude: $longitude, size: $size) {
      items {
        id
        name
        category
        address
        distanceMeters
        isOpen
        imageUrl
        createdAt
      }
      nextCursor
    }
  }
`);

export const newStores = graphql(`
  query newStores($size: Int) {
    newStores(size: $size) {
      items {
        id
        name
        category
        address
        distanceMeters
        isOpen
        imageUrl
        createdAt
      }
      nextCursor
    }
  }
`);

export const orders = graphql(`
  query orders($cursor: String, $size: Int, $statuses: [OrderStatus!]) {
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
  }
`);

export const order = graphql(`
  query order($id: ID!) {
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
  }
`);
