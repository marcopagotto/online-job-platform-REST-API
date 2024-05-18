import { Router } from 'express';
import { isAuthenticated } from '../middlewares/middlewares';
import { listingPublishmentSchema } from '../schemas/listings/listing-publishment';
import {
  createListing,
  deleteListing,
  getListingById,
  updateListing,
} from '../controllers/listings';
import { listingGetByIdSchema } from '../schemas/listings/listing-get-by-id';
import { listingDeleteSchema } from '../schemas/listings/listing-delete';
import { listingUpdateSchema } from '../schemas/listings/listing-update';

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
  router.delete(
    '/listing/:listing_id',
    isAuthenticated,
    listingDeleteSchema,
    deleteListing
  );
  router.put(
    '/listing/:listing_id',
    isAuthenticated,
    listingUpdateSchema,
    updateListing
  );
};
