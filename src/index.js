import { registerPlugin } from '@wordpress/plugins';
import { PluginPrePublishPanel } from '@wordpress/editor';
import { useSelect } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';
import { __ } from '@wordpress/i18n';
import { TextareaControl } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';
import { useState, useEffect } from '@wordpress/element';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';
import './style.scss';

const MaybeCategoryPanel = () => {
	const { hasOnlyDefaultCategory, hasSiteCategories, defaultCategorySlug } = useSelect( ( select ) => {
		const postType = select( editorStore ).getCurrentPostType();
		const { canUser, getEntityRecord, getEntityRecords } = select( coreStore );
		const taxonomy = getEntityRecord( 'root', 'taxonomy', 'category' );
		const defaultCategoryId = canUser( 'read', { kind: 'root', name: 'site' } )
			? getEntityRecord( 'root', 'site' )?.default_category
			: undefined;
		const defaultCategory = defaultCategoryId
			? getEntityRecord( 'taxonomy', 'category', defaultCategoryId )
			: undefined;
		const postTypeSupportsCategories = taxonomy && taxonomy.types.some( ( type ) => type === postType );
		const categories = taxonomy && select( editorStore ).getEditedPostAttribute( taxonomy.rest_base );
		const siteCategories = postTypeSupportsCategories
			? !! getEntityRecords( 'taxonomy', 'category', { exclude: [ defaultCategoryId ], per_page: 1 } )?.length
			: false;

		const onlyDefaultCategory = !! taxonomy &&
			!! defaultCategoryId &&
			postTypeSupportsCategories &&
			( categories?.length === 0 || ( categories?.length === 1 && defaultCategoryId === categories[ 0 ] ) );

		return {
			hasOnlyDefaultCategory: onlyDefaultCategory,
			hasSiteCategories: siteCategories,
			defaultCategorySlug: defaultCategory?.slug,
		};
	}, [] );

	const [ shouldShowPanel, setShouldShowPanel ] = useState( false );

	useEffect( () => {
		console.log( 'Category Panel Debug:', { hasOnlyDefaultCategory, hasSiteCategories, defaultCategorySlug, shouldShowPanel } );
		if ( hasOnlyDefaultCategory ) {
			setShouldShowPanel( true );
		}
	}, [ hasOnlyDefaultCategory, hasSiteCategories, defaultCategorySlug, shouldShowPanel ] );

	if ( ! shouldShowPanel || ! hasSiteCategories || defaultCategorySlug === 'uncategorized-en' ) {
		return null;
	}

	return (
		<PluginPrePublishPanel
			title={ __( 'Assign a category', 'post-checklist' ) }
			initialOpen={ false }
		>
			<p>
				{ __( 'Categories provide a helpful way to group related posts together and to quickly tell readers what a post is about.', 'post-checklist' ) }
			</p>
		</PluginPrePublishPanel>
	);
};

const MaybeInternalLinksPanel = () => {
	const { hasInternalLinks, siteUrl } = useSelect( ( select ) => {
		const content = select( editorStore ).getEditedPostAttribute( 'content' );
		const { getEntityRecord } = select( coreStore );
		const site = getEntityRecord( 'root', '__unstableBase', undefined );
		const url = site?.url || window.location.origin;

		const parser = new DOMParser();
		const doc = parser.parseFromString( content, 'text/html' );
		const links = Array.from( doc.querySelectorAll( 'a[href]' ) );

		const internalLinks = links.filter( ( link ) => {
			const href = link.getAttribute( 'href' );
			return href && ( href.startsWith( url ) || href.startsWith( '/' ) );
		} );

		return {
			hasInternalLinks: internalLinks.length > 0,
			siteUrl: url,
		};
	}, [] );

	const [ shouldShowPanel, setShouldShowPanel ] = useState( false );

	useEffect( () => {
		console.log( 'Internal Links Panel Debug:', { hasInternalLinks, siteUrl, shouldShowPanel } );
		if ( ! hasInternalLinks ) {
			setShouldShowPanel( true );
		}
	}, [ hasInternalLinks, siteUrl, shouldShowPanel ] );

	if ( ! shouldShowPanel ) {
		return null;
	}

	return (
		<PluginPrePublishPanel
			title={ __( 'Add internal link', 'post-checklist' ) }
			initialOpen={ false }
		>
			<p>
				{ __( 'Internal links help readers discover related content and improve SEO. Consider linking to a relevant post or page on your site.', 'post-checklist' ) }
			</p>
		</PluginPrePublishPanel>
	);
};

const MaybeExcerptPanel = () => {
	const { excerpt } = useSelect( ( select ) => {
		const editor = select( editorStore );
		return {
			excerpt: editor.getEditedPostAttribute( 'excerpt' ) || '',
		};
	}, [] );

	const { editPost } = useDispatch( editorStore );
	const [ shouldShowPanel, setShouldShowPanel ] = useState( false );

	useEffect( () => {
		console.log( 'Excerpt Panel Debug:', { excerpt, shouldShowPanel } );
		if ( ! excerpt.trim() ) {
			setShouldShowPanel( true );
		}
	}, [ excerpt, shouldShowPanel ] );

	if ( ! shouldShowPanel ) {
		return null;
	}

	return (
		<PluginPrePublishPanel
			title={ __( 'Add excerpt', 'post-checklist' ) }
			initialOpen={ false }
		>
			<p>
				{ __( 'An excerpt is used for SEO meta descriptions (og:description) and post previews. It should be a concise summary of your content.', 'post-checklist' ) }
			</p>
			<TextareaControl
				__nextHasNoMarginBottom
				label={ __( 'Write an excerpt (optional)', 'post-checklist' ) }
				value={ excerpt }
				onChange={ ( value ) => editPost( { excerpt: value } ) }
				help={ __( 'Recommended: 150-160 characters for optimal SEO', 'post-checklist' ) }
			/>
		</PluginPrePublishPanel>
	);
};

const MaybeFeaturedImagePanel = () => {
	const { featuredImageId } = useSelect( ( select ) => {
		const editor = select( editorStore );
		return {
			featuredImageId: editor.getEditedPostAttribute( 'featured_media' ),
		};
	}, [] );

	const { editPost } = useDispatch( editorStore );
	const [ shouldShowPanel, setShouldShowPanel ] = useState( false );

	useEffect( () => {
		console.log( 'Featured Image Panel Debug:', { featuredImageId, shouldShowPanel } );
		if ( ! featuredImageId ) {
			setShouldShowPanel( true );
		}
	}, [ featuredImageId, shouldShowPanel ] );

	if ( ! shouldShowPanel ) {
		return null;
	}

	return (
		<PluginPrePublishPanel
			title={ __( 'Set featured image', 'post-checklist' ) }
			initialOpen={ false }
		>
			<p>
				{ __( 'A featured image represents your post in listings and social media shares (og:image). It improves engagement and click-through rates.', 'post-checklist' ) }
			</p>
			<MediaUploadCheck>
				<MediaUpload
					onSelect={ ( media ) => editPost( { featured_media: media.id } ) }
					allowedTypes={ [ 'image' ] }
					value={ featuredImageId }
					render={ ( { open } ) => (
						<Button variant="primary" onClick={ open }>
							{ __( 'Select Featured Image', 'post-checklist' ) }
						</Button>
					) }
				/>
			</MediaUploadCheck>
		</PluginPrePublishPanel>
	);
};

const CategoryPanel = () => {
	return <MaybeCategoryPanel />;
};

const InternalLinksPanel = () => {
	return <MaybeInternalLinksPanel />;
};

const ExcerptPanel = () => {
	return <MaybeExcerptPanel />;
};

const FeaturedImagePanel = () => {
	return <MaybeFeaturedImagePanel />;
};

console.log( 'Post Checklist Plugin Loading...' );

registerPlugin( 'post-checklist-category', {
	render: CategoryPanel,
} );

registerPlugin( 'post-checklist-internal-links', {
	render: InternalLinksPanel,
} );

registerPlugin( 'post-checklist-excerpt', {
	render: ExcerptPanel,
} );

registerPlugin( 'post-checklist-featured-image', {
	render: FeaturedImagePanel,
} );

console.log( 'Post Checklist Plugins Registered' );
