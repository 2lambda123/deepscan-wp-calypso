import page from '@automattic/calypso-router';
import {
	A4A_REFERRALS_LINK,
	A4A_REFERRALS_BANK_DETAILS_LINK,
} from 'calypso/a8c-for-agencies/components/sidebar-menu/lib/constants';
import { makeLayout, render as clientRender } from 'calypso/controller';
import * as controller from './controller';

export default function () {
	page( A4A_REFERRALS_LINK, controller.referralsContext, makeLayout, clientRender );
	page(
		A4A_REFERRALS_BANK_DETAILS_LINK,
		controller.referralsBankDetailsContext,
		makeLayout,
		clientRender
	);
}
