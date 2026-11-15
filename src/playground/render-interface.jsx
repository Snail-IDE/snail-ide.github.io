/**
 * Copyright (C) 2021 Thomas Weber
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { FormattedMessage, defineMessages, injectIntl, intlShape } from 'react-intl';
import { getIsLoading } from '../reducers/project-state.js';
import DOMElementRenderer from '../containers/dom-element-renderer.jsx';
import AppStateHOC from '../lib/app-state-hoc.jsx';
import Comments from '../components/comments/comments.jsx';
import ErrorBoundaryHOC from '../lib/error-boundary-hoc.jsx';
import TWProjectMetaFetcherHOC from '../lib/tw-project-meta-fetcher-hoc.jsx';
import TWStateManagerHOC from '../lib/tw-state-manager-hoc.jsx';
import TWThemeHOC from '../lib/tw-theme-hoc.jsx';
import SBFileUploaderHOC from '../lib/sb-file-uploader-hoc.jsx';
import TWPackagerIntegrationHOC from '../lib/tw-packager-integration-hoc.jsx';
import TWRestorePointHOC from '../lib/tw-restore-point-hoc.jsx';
import SettingsStore from '../addons/settings-store-singleton';
import '../lib/tw-fix-history-api';
import GUI from './render-gui.jsx';
import VoteFrame from './vote-frame.jsx';
import MenuBar from '../components/menu-bar/menu-bar.jsx';
import ProjectInput from '../components/tw-project-input/project-input.jsx';
import FeaturedProjects from '../components/tw-featured-projects/featured-projects.jsx';
import LikeButton from '../components/sn-likebtn/LikeButton.jsx';
import Description from '../components/tw-description/description.jsx';
import WebGlModal from '../containers/webgl-modal.jsx';
import BrowserModal from '../components/browser-modal/browser-modal.jsx';
import CloudVariableBadge from '../components/tw-cloud-variable-badge/cloud-variable-badge.jsx';
import { isRendererSupported, isBrowserSupported } from '../lib/tw-environment-support-prober';
import AddonChannels from '../addons/channels';
import { loadServiceWorker } from './load-service-worker';
import runAddons from '../addons/entry';

import styles from './interface.css';
import restore from './restore.js';

const urlparams = new URLSearchParams(location.search);
const restoring = urlparams.get("restore");
const restoreHandler = urlparams.get("handler");
if (String(restoring) === "true") {
    console.log(restore)
    restore(restoreHandler);
}

let announcement = null;
if (process.env.ANNOUNCEMENT) {
    announcement = document.createElement('p');
    // This is safe because process.env.ANNOUNCEMENT is set at build time.
    announcement.innerHTML = process.env.ANNOUNCEMENT;
}

const handleClickAddonSettings = () => {
    const path = process.env.ROUTING_STYLE === 'wildcard' ? 'addons' : 'addons.html';
    window.open(`${process.env.ROOT}${path}`);
};

const messages = defineMessages({
    defaultTitle: {
        defaultMessage: 'A mod of PenguinMod',
        description: 'Title of homepage',
        id: 'tw.guiDefaultTitle'
    }
});

const WrappedMenuBar = compose(
    SBFileUploaderHOC,
    TWPackagerIntegrationHOC
)(MenuBar);

if (AddonChannels.reloadChannel) {
    AddonChannels.reloadChannel.addEventListener('message', () => {
        location.reload();
    });
}

if (AddonChannels.changeChannel) {
    AddonChannels.changeChannel.addEventListener('message', e => {
        SettingsStore.setStoreWithVersionCheck(e.data);
    });
}

runAddons();

const projectDetailCache = {};
const getProjectDetailsById = async (id) => {
    // if we have already gotten the details of this project, avoid making another request since they likely never changed
    if (projectDetailCache[String(id)] != null) return projectDetailCache[String(id)];

    const response = await fetch(`https://snailshare.dreamhosters.com/api/pmWrapper/getProject?id=${id}`);
    // Don't continue if the api never returned 200-299 since we would cache an error as project details
    if (!response.ok) return {};

    const project = await response.json();
    projectDetailCache[String(id)] = project;
    return projectDetailCache[String(id)];
};

const Footer = () => (
    <footer className={styles.footer}>
        <div className={styles.footerContent}>
            <div className={styles.footerText}>
                <FormattedMessage
                    // eslint-disable-next-line max-len
                    defaultMessage="PenguinMod, Snail IDE, and TurboWarp are not affiliated with Scratch, the Scratch Team, or the Scratch Foundation."
                    description="Disclaimer that PenguinMod, Snail IDE, and TurboWarp are not connected to Scratch"
                    id="tw.footer.disclaimer"
                />
            </div>
            <div className={styles.footerColumns}>
                <div className={styles.footerSection}>
                    <a href="credits.html">
                        <FormattedMessage
                            defaultMessage="Credits"
                            description="Credits link in footer"
                            id="tw.footer.credits"
                        />
                    </a>
                    <a href="https://github.com/sponsors/GarboMuffin">
                        <FormattedMessage
                            defaultMessage="Donate to TurboWarp Developer"
                            description="Donation link in footer"
                            id="tw.footer.donate"
                        />
                    </a>
                    <a href="https://penguinmod.site/donate">
                        <FormattedMessage
                            defaultMessage="Donate to PenguinMod Developer"
                            description="Donation link in footer"
                            id="tw.footer.penguinmod-donate"
                        />
                    </a>
                </div>
                <div className={styles.footerSection}>
                    <a href="https://studio.penguinmod.site/PenguinMod-Packager">
                        {/* Do not translate */}
                        {'PenguinMod Packager'}
                    </a>
                    <a href="https://desktop.turbowarp.org/">
                        {/* Do not translate */}
                        {'TurboWarp Desktop'}
                    </a>
                    <a href="https://docs.turbowarp.org/docs/embedding">
                        <FormattedMessage
                            defaultMessage="Embedding"
                            description="Link in footer to embedding documentation for embedding link"
                            id="tw.footer.embed"
                        />
                    </a>
                    <a href="https://docs.turbowarp.org/docs/url-parameters">
                        <FormattedMessage
                            defaultMessage="URL Parameters"
                            description="Link in footer to URL parameters documentation"
                            id="tw.footer.parameters"
                        />
                    </a>
                    <a href="https://docs.snail-ide.com/">
                        <FormattedMessage
                            defaultMessage="Documentation"
                            description="Link in footer to additional documentation"
                            id="tw.footer.documentation"
                        />
                    </a>
                </div>
                <div className={styles.footerSection}>
                    <a href="https://scratch.mit.edu/users/Mr_rudy/">
                        <FormattedMessage
                            defaultMessage="Feedback & Bugs"
                            description="Link to feedback/bugs page"
                            id="tw.feedback"
                        />
                    </a>
                    <a href="https://github.com/Snail-IDE/">
                        <FormattedMessage
                            defaultMessage="Source Code"
                            description="Link to source code"
                            id="tw.code"
                        />
                    </a>
                    <a href="privacy.html">
                        <FormattedMessage
                            defaultMessage="Privacy Policy"
                            description="Link to privacy policy"
                            id="tw.privacy"
                        />
                    </a>
                    <a href="https://snail-ide.js.org/examples/">
                        <FormattedMessage
                            defaultMessage="Example Projects"
                            description="Link to example projects"
                            id="tw.examples"
                        />
                    </a>
                    <a href="https://snail-ide.js.org/editor.html?livetests">
                        <FormattedMessage
                            defaultMessage="Live Tests"
                            description="Opens the livetests page"
                            id="tw.livetests"
                        />
                    </a>
                    <a href="https://scratch.mit.edu/studios/33532977/">
                        <FormattedMessage
                            defaultMessage="Scratch Studio"
                            description="Link to scratch studio"
                            id="tw.snail-studio"
                        />
                    </a>
                    <a href="https://scratch.mit.edu/discuss/topic/689165/">
                        <FormattedMessage
                            defaultMessage="Scratch Forum Topic"
                            description="Link to the Scratch forum topic for Snail IDE"
                            id="si.scratch-forum-topic"
                        />
                    </a>
                    <a href="https://snailshare.vercel.app">
                        <FormattedMessage
                            defaultMessage="Homepage"
                            description="Link to homepage"
                            id="tw.beta"
                        />
                    </a>
                </div>
            </div>
        </div>
    </footer>
);

class Interface extends React.Component {
    constructor(props) {
        super(props);
        this.handleUpdateProjectTitle = this.handleUpdateProjectTitle.bind(this);
        this.state = {
            loginData: {}
        }
        window.addEventListener('message', (event) => {
            if (event.origin !== 'https://snailshare.vercel.app/') return;
               this.setState({ loginData: event.data });
               console.log(event.data);
            }
        );
    }
    componentDidUpdate(prevProps) {
        if (prevProps.isLoading && !this.props.isLoading) {
            loadServiceWorker();
        }
    }
    handleUpdateProjectTitle(title, isDefault) {
        if (isDefault || !title) {
            document.title = `Snail IDE - ${this.props.intl.formatMessage(messages.defaultTitle)}`;
        } else {
            document.title = `${title} - Snail IDE`;
        }
    }
    render() {
        const {
            /* eslint-disable no-unused-vars */
            intl,
            hasCloudVariables,
            description,
            isFullScreen,
            isLoading,
            isPlayerOnly,
            isRtl,
            onClickTheme,
            projectId,
            /* eslint-enable no-unused-vars */
            ...props
        } = this.props;
        const isHomepage = isPlayerOnly && !isFullScreen;
        const isEditor = !isPlayerOnly;
        return (
            <div
                className={classNames(styles.container, {
                    [styles.playerOnly]: isHomepage,
                    [styles.editor]: isEditor
                })}
            >
                <iframe
                    id='login'
                    style={{ display: 'none' }}
                    src={`https://snailshare.vercel.app/embed/editor?external=${window.location}`}
                ></iframe>
                {isHomepage ? (
                    <div className={styles.menu}>
                        <WrappedMenuBar
                            canChangeLanguage
                            canManageFiles
                            enableSeeInside
                            onClickAddonSettings={handleClickAddonSettings}
                            onClickTheme={onClickTheme}
                            username={this.state.loginData.packet?.username}
                        />
                    </div>
                ) : null}
                <div
                    className={styles.center}
                    style={isPlayerOnly ? ({
                        // add a couple pixels to account for border (TODO: remove weird hack)
                        width: `${Math.max(480, props.customStageSize.width) + 2}px`
                    }) : null}
                >
                    {isHomepage && announcement ? <DOMElementRenderer domElement={announcement} /> : null}
                    <GUI
                        onClickAddonSettings={handleClickAddonSettings}
                        onClickTheme={onClickTheme}
                        onUpdateProjectTitle={this.handleUpdateProjectTitle}
                        backpackVisible
                        backpackHost="_local_"
                        username={this.state.loginData.packet?.username}
                        {...props}
                    />
                    {isHomepage ? (
                        <React.Fragment>
                            {projectId && projectId !== '0' ? (
                                <div className={styles.remixWarningBox}>
                                    <p>
                                        <a href="https://www.gnu.org/licenses/gpl-3.0.en.html">
                                            This program is free software: you can redistribute it and/or modify
                                            it under the terms of the GNU General Public License as published by
                                            the Free Software Foundation, either version 3 of the License, or
                                            (at your option) any later version.
                                        </a>
                                    </p>
                                </div>
                            ) : null}
                            {/* project not approved message */}
                            {(window.LastFetchedProject) != null && (window.LastFetchedProject.accepted == false) ? (
                                <div className={styles.remixWarningBox}>
                                    <p>This project is not approved. Be careful when running this project.</p>
                                </div>
                            ) : null}
                            {/* project too large to remix message */}
                            {(window.LastFetchedProject) != null && (window.LastFetchedProject.tooLarge == true) ? (
                                <div className={styles.remixWarningBox}>
                                    <p>This project is too large to be remixed. If you would like to remix this project, please contact someone who can manually upload it for you.</p>
                                </div>
                            ) : null}
                            {/* its time for some absolutely BANGER react code boys */}
                            {(window.LastFetchedProject) != null && (window.LastFetchedProject.remix != null) ? (
                                <div className={styles.unsharedUpdate}>
                                    <div style={{ display: "flex", flexDirection: "row" }}>
                                        <a style={{ height: "32px" }} target="_blank" href={"https://snailshare.vercel.app/profile?user=" + projectDetailCache[String(window.LastFetchedProject.remix)]?.owner}><img style={{ marginRight: "4px", borderRadius: "4px" }} width="32" height="32" title={projectDetailCache[String(window.LastFetchedProject.remix)]?.owner} alt={projectDetailCache[String(window.LastFetchedProject.remix)]?.owner} src={"https://snailshare.dreamhosters.com/api/pmWrapper/scratchUserImage?username=" + projectDetailCache[String(window.LastFetchedProject.remix)]?.owner}></img></a>
                                        <p>Thanks to <b><a target="_blank" href={"https://snailshare.vercel.app/profile?user=" + projectDetailCache[String(window.LastFetchedProject.remix)]?.owner}>{projectDetailCache[String(window.LastFetchedProject.remix)]?.owner}</a></b> for the original project <b><a href={window.location.origin + "/#" + projectDetailCache[String(window.LastFetchedProject.remix)]?.id}>{projectDetailCache[String(window.LastFetchedProject.remix)]?.name}</a></b>.</p>
                                    </div>
                                    <div style={{ display: 'none' }}>{getProjectDetailsById(window.LastFetchedProject.remix).yesIDefinetlyKnowHowToUseReactProperlyShutUp}</div>
                                </div>
                            ) : null}
                            {isRendererSupported() ? null : (
                                <WebGlModal isRtl={isRtl} />
                            )}
                            {isBrowserSupported() ? null : (
                                <BrowserModal isRtl={isRtl} />
                            )}
                            {hasCloudVariables && projectId !== '0' && (
                                <div className={styles.section}>
                                    <CloudVariableBadge />
                                </div>
                            )}
                            {description.instructions || description.credits ? (
                                <div className={styles.section}>
                                    <Description
                                        instructions={description.instructions}
                                        credits={description.credits}
                                        projectId={projectId}
                                    />
                                </div>
                            ) : null}
                            <VoteFrame id={projectId} darkmode={this.props.isDark}></VoteFrame>
                            {isHomepage && window.FetchedProjectRemixes ? (
                                <div>
                                    {/* i have absolutely no interest in figuring out how the heck to get this to work properly */}
                                    <div style={{ display: "none" }}>{window.ForceProjectRemixListUpdate}</div>
                                    <p>Remixes of <b>{window.LastFetchedProject.name}</b></p>
                                    <div className={styles.remixList}>
                                        {window.FetchedProjectRemixes.map(remix => {
                                            return <a key={remix.id} href={"#" + remix.id} style={{ textDecoration: "none", width: "115%" }}>
                                                <div className={styles.remixProject}>
                                                    <img style={{ height: "72px" }} src={remix.image} alt={remix.name}></img>
                                                    <div style={{ width: "100%", display: "flex", textAlign: "left", textDecoration: "none", flexDirection: "column", alignItems: "flex-start" }}>
                                                        <p style={{ fontSize: "1em" }}><b>{remix.name}</b></p>
                                                        <p style={{ fontSize: "1em" }}>by <b>{remix.owner}</b></p>
                                                    </div>
                                                </div>
                                            </a>
                                        })}
                                    </div>
                                </div>
                            ) : null}
                            {((window.LastFetchedProject) != null) ? (
                                <a target="_blank" href={"https://snailshare.vercel.app/profile?user=" + window.LastFetchedProject.owner}>View other projects by {window.LastFetchedProject.owner}</a>
                            ) : null}
                            <div className={styles.section}>
                                <p>
                                    <FormattedMessage
                                        // eslint-disable-next-line max-len
                                        defaultMessage="[Snail IDE](snail-ide.js.org) is a mod of (Penguinmod)[studio.penguinmod.com] to add new blocks and features either in extensions or in Snail IDE's main toolbox. [PenguinMod](studio.penguinmod.com) is a [TurboWarp](turbowarp.org) 
                                        mod that adds features for advanced use. Try it out by choosing an uploaded project below or making your own in the editor. [TurboWarp](turbowarp.org) is a [Scratch](scratch.mit.edu) mod that compiles projects to JavaScript to make them run really fast."
                                        description="Description of Snail IDE and PenguinMod and TurboWarp and Scratch Expanded"
                                        id="tw.home.description"
                                    />
                                </p>
                            </div>
                            {projectId && projectId !== '0' && (
                                <div>
                                    <div className={styles.centerSector}>
                                        <a
                                            target="_blank"
                                            rel="noreferrer"
                                            href={`https://snailshare.vercel.app/report?type=project&id=${projectId}`}
                                            className={styles.reportLink}
                                        >
                                            <img
                                                src="https://studio.penguinmod.com/report_flag.png"
                                                alt="!"
                                            />
                                            {'Report'}
                                        </a>
                                    </div>
                                    <div className={styles.centerSector}>
                                    </div>
                                </div>
                            )}

                            <div className={styles.section}>
                                <FeaturedProjects />
                            </div>
                            <a target="_blank" href="https://snailshare.vercel.app/search?q=all:projects">View projects in new tab</a>
                        </React.Fragment>
                    ) : null}
                </div>
                {isHomepage && <Footer />}
            </div>
        );
    }
}

Interface.propTypes = {
    intl: intlShape,
    hasCloudVariables: PropTypes.bool,
    customStageSize: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number
    }),
    description: PropTypes.shape({
        credits: PropTypes.string,
        instructions: PropTypes.string
    }),
    isFullScreen: PropTypes.bool,
    isLoading: PropTypes.bool,
    isPlayerOnly: PropTypes.bool,
    isRtl: PropTypes.bool,
    onClickTheme: PropTypes.func,
    projectId: PropTypes.string
};

const mapStateToProps = state => ({
    hasCloudVariables: state.scratchGui.tw.hasCloudVariables,
    customStageSize: state.scratchGui.customStageSize,
    description: state.scratchGui.tw.description,
    isFullScreen: state.scratchGui.mode.isFullScreen,
    isLoading: getIsLoading(state.scratchGui.projectState.loadingState),
    isPlayerOnly: state.scratchGui.mode.isPlayerOnly,
    isRtl: state.locales.isRtl,
    projectId: state.scratchGui.projectState.projectId
});

const mapDispatchToProps = () => ({});

const ConnectedInterface = injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(Interface));

const WrappedInterface = compose(
    AppStateHOC,
    ErrorBoundaryHOC('TW Interface'),
    TWProjectMetaFetcherHOC,
    TWStateManagerHOC,
    TWThemeHOC,
    TWRestorePointHOC,
    TWPackagerIntegrationHOC
)(ConnectedInterface);

export default WrappedInterface;
