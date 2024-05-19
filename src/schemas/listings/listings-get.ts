import {
  queryAmountValidator,
  queryNewFirstValidator,
} from '../../utils/custom-validators';

export const listingsGetSchema = [
  queryAmountValidator('amount'),
  queryNewFirstValidator('newFirst'),
];
