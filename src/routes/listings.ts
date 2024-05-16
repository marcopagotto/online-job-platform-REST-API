import { Router } from 'express';
import { isAuthenticated } from '../middlewares/middlewares';
import { listingPublishmentSchema } from '../schemas/listings/listing-publishment';
import { createListing, getListingById } from '../controllers/listings';
import { listingGetByIdSchema } from '../schemas/listings/listing-get-by-id';

export default (router: Router) => {
  router.post(
    '/listing',
    isAuthenticated,
    listingPublishmentSchema,
    createListing
  );
  router.get(
    '/listing/:listing_id',
    isAuthenticated,
    listingGetByIdSchema,
    getListingById
  );
};
