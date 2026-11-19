import { graphql } from './__generated__';
import type { PromotionsQuery, StoresQuery } from './__generated__/graphql';

export type Store = StoresQuery['stores']['items'][number];
export type Promotion = PromotionsQuery['promotions'][number];

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
