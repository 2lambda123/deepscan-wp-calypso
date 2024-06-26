import { useSitesListFiltering, useSitesListGrouping } from '@automattic/sites';
import { GroupableSiteLaunchStatuses } from '@automattic/sites/src/use-sites-list-grouping';
import { useI18n } from '@wordpress/react-i18n';
import classNames from 'classnames';
import { translate } from 'i18n-calypso';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
	DATAVIEWS_TABLE,
	initialDataViewsState,
} from 'calypso/a8c-for-agencies/components/items-dashboard/constants';
import { DataViewsState } from 'calypso/a8c-for-agencies/components/items-dashboard/items-dataviews/interfaces';
import Layout from 'calypso/a8c-for-agencies/components/layout';
import LayoutColumn from 'calypso/a8c-for-agencies/components/layout/column';
import LayoutHeader, {
	LayoutHeaderActions as Actions,
	LayoutHeaderTitle as Title,
} from 'calypso/a8c-for-agencies/components/layout/header';
import LayoutTop from 'calypso/a8c-for-agencies/components/layout/top';
import DocumentHead from 'calypso/components/data/document-head';
import { useSiteExcerptsQuery } from 'calypso/data/sites/use-site-excerpts-query';
import {
	SitesDashboardQueryParams,
	handleQueryParamChange,
} from 'calypso/sites-dashboard/components/sites-content-controls';
import {
	useShowSiteCreationNotice,
	useShowSiteTransferredNotice,
} from 'calypso/sites-dashboard/components/sites-dashboard';
import { useDispatch } from 'calypso/state';
import { setSelectedSiteId } from 'calypso/state/ui/actions';
import DotcomPreviewPane from './site-preview-pane/dotcom-preview-pane';
import SitesDashboardHeader from './sites-dashboard-header';
import DotcomSitesDataViews, { siteStatusGroups } from './sites-dataviews';

// todo: we are using A4A styles until we extract them as common styles in the ItemsDashboard component
import './style.scss';

// Add Dotcom specific styles
import './dotcom-style.scss';

interface SitesDashboardProps {
	queryParams: SitesDashboardQueryParams;
	updateQueryParams?: ( params: SitesDashboardQueryParams ) => void;
}

const SitesDashboardV2 = ( {
	queryParams: { page = 1, perPage = 96, search, newSiteID, status = 'all' },
	updateQueryParams = handleQueryParamChange,
}: SitesDashboardProps ) => {
	const { __ } = useI18n();
	const dispatch = useDispatch();

	const { data: liveSites = [], isLoading } = useSiteExcerptsQuery(
		[],
		( site ) => ! site.options?.is_domain_only
	);

	const { data: deletedSites = [] } = useSiteExcerptsQuery(
		[],
		( site ) => ! site.options?.is_domain_only,
		'deleted'
	);

	const allSites = liveSites.concat( deletedSites );

	useShowSiteCreationNotice( allSites, newSiteID );
	useShowSiteTransferredNotice();

	// Create the DataViews state based on initial values
	const defaultDataViewsState = {
		...initialDataViewsState,
		page,
		perPage,
		search: search ?? '',
		filters:
			status === 'all'
				? []
				: [
						{
							field: 'status',
							operator: 'in',
							value: siteStatusGroups.find( ( item ) => item.slug === status )?.value || 1,
						},
				  ],
	};
	const [ dataViewsState, setDataViewsState ] = useState< DataViewsState >( defaultDataViewsState );

	// Get the status group slug.
	const statusSlug = useMemo( () => {
		const statusFilter = dataViewsState.filters.find( ( filter ) => filter.field === 'status' );
		const statusNumber = statusFilter?.value || 1;
		return ( siteStatusGroups.find( ( status ) => status.value === statusNumber )?.slug ||
			'all' ) as GroupableSiteLaunchStatuses;
	}, [ dataViewsState.filters ] );

	// Filter sites list by status group.
	const { currentStatusGroup } = useSitesListGrouping( allSites, {
		status: statusSlug,
		showHidden: true,
	} );

	// Filter sites list by search query.
	const filteredSites = useSitesListFiltering( currentStatusGroup, {
		search: dataViewsState.search,
	} );
	// todo: Perform pagination and sorting actions

	// Site is selected:
	useEffect( () => {
		if ( dataViewsState.selectedItem ) {
			// Set the selected site ID globally at Dotcom
			dispatch( setSelectedSiteId( dataViewsState.selectedItem.ID ) );
		} else {
			// Reset the selected site ID globally at Dotcom
			dispatch( setSelectedSiteId( null ) );
		}
	}, [ dataViewsState.selectedItem ] );

	// Update URL with search param on change
	useEffect( () => {
		const queryParams = {
			search: dataViewsState.search?.trim(),
			status: statusSlug === 'all' ? undefined : statusSlug,
		};

		// There is a chance that the URL is not up to date when it mounts, so bump the
		// updateQueryParams call to the back of the stack to avoid it getting the incorrect URL and
		// then redirecting back to the previous path.
		window.setTimeout( () => updateQueryParams( queryParams ) );
	}, [ dataViewsState.search, statusSlug, updateQueryParams ] );

	// Manage the closing of the preview pane
	const closeSitePreviewPane = useCallback( () => {
		if ( dataViewsState.selectedItem ) {
			setDataViewsState( { ...dataViewsState, type: DATAVIEWS_TABLE, selectedItem: undefined } );
			//setHideListing( false );
		}
	}, [ dataViewsState, setDataViewsState ] );

	// todo: temporary mock data
	const hideListing = false;
	const isNarrowView = false;

	return (
		<Layout
			className={ classNames(
				'sites-dashboard',
				'sites-dashboard__layout',
				! dataViewsState.selectedItem && 'preview-hidden'
			) }
			wide
			title={ dataViewsState.selectedItem ? null : translate( 'Sites' ) }
		>
			<DocumentHead title={ __( 'Sites' ) } />

			{ ! hideListing && (
				<LayoutColumn className="sites-overview" wide>
					<LayoutTop withNavigation={ false }>
						<LayoutHeader>
							{ ! isNarrowView && <Title>{ translate( 'Sites' ) }</Title> }
							<Actions>
								<SitesDashboardHeader />
							</Actions>
						</LayoutHeader>
					</LayoutTop>

					<DocumentHead title={ __( 'Sites' ) } />
					<DotcomSitesDataViews
						sites={ filteredSites }
						isLoading={ isLoading }
						dataViewsState={ dataViewsState }
						setDataViewsState={ setDataViewsState }
					/>
				</LayoutColumn>
			) }

			{ dataViewsState.selectedItem && (
				<LayoutColumn className="site-preview-pane" wide>
					<DotcomPreviewPane
						site={ dataViewsState.selectedItem }
						closeSitePreviewPane={ closeSitePreviewPane }
					/>
				</LayoutColumn>
			) }
		</Layout>
	);
};

export default SitesDashboardV2;
