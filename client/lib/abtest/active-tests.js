module.exports = {
	multiDomainRegistrationV1: {
		datestamp: '20200721',
		variations: {
			singlePurchaseFlow: 10,
			popupCart: 45,
			keepSearchingInGapps: 45
		},
		defaultVariation: 'singlePurchaseFlow'
	},
	userFirstSignup: {
		datestamp: '20160124',
		variations: {
			userLast: 100,
			userFirst: 0,
		},
		defaultVariation: 'userLast',
		allowExistingUsers: false,
	},
	signupStepOneCopyChanges: {
		datestamp: '20170307',
		variations: {
			original: 0,
			modified: 100, //Test completed. Sending copy for translation.
		},
		defaultVariation: 'original',
	},
	readerPostCardTagCount: {
		datestamp: '20170315',
		variations: {
			showOne: 50,
			showThree: 50
		},
		defaultVariation: 'showThree',
		allowExistingUsers: true
	},
	automatedTransfer3: {
		datestamp: '20170316',
		variations: {
			enabled: 50,
			disabled: 50,
		},
		defaultVariation: 'disabled',
		allowExistingUsers: false
	},

	jetpackNewDescriptions: {
		datestamp: '20170327',
		variations: {
			showNew: 50,
			showOld: 50
		},
		defaultVariation: 'showOld',
		allowExistingUsers: true
	},
};
