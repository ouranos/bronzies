/** @jsx jsx */
import { useTransition, animated } from 'react-spring';
import { jsx, keyframes } from '@emotion/core';
import PropTypes from 'prop-types';
import { Fragment } from 'react';

/**
 * Animation showing a spinner
 */
function Animation({ loadingState }) {
	const loading = keyframes({
		from: {
			backgroundPosition: '0px 0px',
		},
		to: {
			backgroundPosition: '-16px 0px',
		}
	});

	const messages = {
		loading: 'Loading',
		stale: `... still loading data, hang tight`,
		failed: <Fragment>
			I can't seem to fetch the data I need
			<span css={{
				display: 'block',
				fontSize: '1rem',
			}}>
				Try refreshing the page and if that doesn't work <a href="https://dominik-wilkowski.com/" rel='noopener noreferrer' target='_blank'>submit an issue to
				the app</a> or contact the maintainer <a href="https://dominik-wilkowski.com/" rel='noopener noreferrer' target='_blank'>Dominik</a>
			</span>
		</Fragment>,
	};

	return (
		<div css={{
			position: 'fixed',
			left: 0,
			right: 0,
			top: 0,
			bottom: 0,
			backgroundColor: '#fff',
			display: 'grid',
		}}>
			<div css={{
				margin: 'auto',
				textAlign: 'center',
				fontSize: '2rem',
			}}>
				<div css={{
					position: 'relative',
					width: '3rem',
					height: '3rem',
					border: '1px #000 solid',
					margin: '1rem auto 1.5rem auto',
					borderRadius: '100%',
					background: 'linear-gradient(45deg, transparent 49%, #000 50%, #000 50%, transparent 51%, transparent),' +
						'linear-gradient(-45deg, transparent 49%, #000 50%, #000 50%, transparent 51%, transparent)',
					backgroundSize: '16px 16px',
					backgroundPosition: '0% 0%',
					animation: `${ loading } 1s infinite linear`,
					':after': {
						content: '""',
						display: 'block',
						position: 'absolute',
						top: '-1.1rem',
						left: '-1.1rem',
						width: '5rem',
						height: '5rem',
						border: '1px #000 solid',
						borderRadius: '100%',
					},
					':before': loadingState === 'failed'
						? {
								content: '"!"',
								position: 'absolute',
								width: '3rem',
								textAlign: 'center',
								left: '0',
								top: '0',
								fontSize: '3rem',
								lineHeight: '1',
							}
						: {},
				}}></div>
				<span>{ messages[ loadingState ] }</span>
			</div>
		</div>
	);
};

/**
 * Component to switch between loading spinner and component
 *
 * @param {function} options.Component - A component to display after loading is done
 */
function Loading({ loadingState, children }) {
	const isLoading = loadingState !== 'loaded';
	const transitions = useTransition( isLoading, null, {
		initial: { opacity: 1 },
		from: { opacity: 1 },
		enter: { opacity: 1 },
		leave: { opacity: 0 },
		config: { duration: 700 },
	});

	return (
		<Fragment>
			{
				transitions.map( ({ item, props }) => {
					return item
						? <animated.div key='loading' style={ props } css={{
								position: 'absolute',
								backgroundColor: '#fff',
								top: 0,
								left: 0,
								right: 0,
								zIndex: 2,
							}}><Animation loadingState={ loadingState } /></animated.div>
						: <animated.div key='loaded' style={ props } css={{
								position: 'relative',
								zIndex: 1,
							}}>{ children }</animated.div>
				})
			}
		</Fragment>
	);
};

Loading.propTypes = {
	children: PropTypes.node.isRequired,
};

export default Loading;
