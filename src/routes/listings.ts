import { Router } from 'express';
import { isAuthenticated } from '../middlewares/middlewares';
import { listingPublishmentSchema } from '../schemas/listings/listing-publishment';
import { createListing } from '../controllers/listings';

export default (router: Router) => {
  router.post(
    '/listing',
    isAuthenticated,
    listingPublishmentSchema,
    createListing
  );
};
