import DocumentHead from 'calypso/components/data/document-head';
import BoostSitePerformance from 'calypso/jetpack-cloud/sections/agency-dashboard/sites-overview/site-expanded-content/boost-site-performance';
import SitePreviewPaneContent from '../../site-preview-pane/site-preview-pane-content';
import SitePreviewPaneFooter from '../../site-preview-pane/site-preview-pane-footer';
import { Site } from '../../types';

type Props = {
	site: Site;
	trackEvent: ( eventName: string ) => void;
	hasError?: boolean;
};

export function JetpackBoostPreview( { site, trackEvent, hasError = false }: Props ) {
	return (
		<>
			<DocumentHead title="Boost" />
			<SitePreviewPaneContent className="site-preview-pane__boost-content">
				<BoostSitePerformance site={ site } trackEvent={ trackEvent } hasError={ hasError } />
			</SitePreviewPaneContent>
			<SitePreviewPaneFooter />
		</>
	);
}
