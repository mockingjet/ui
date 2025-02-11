import React from 'react';
import styled, { StyledFunction } from 'styled-components';
import Button, { ButtonProps } from '../Button';
import tokens from '../../../tokens';

const button: StyledFunction<typeof Button> = styled(Button);

const ButtonBase: React.FC<ButtonProps> = button`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: ${tokens.space.none} ${tokens.space.m};
	min-height: ${tokens.sizes.xxl};
	border: ${tokens.borders.normal};
	border-radius: ${tokens.radii.rectRadius};
	transition: ${tokens.transitions.fast};

	&,
	&:hover,
	&:focus {
		color: var(--t-button-color, ${({ theme }) => theme.colors?.textColor});
		background: var(--t-button-background-color);
		border-color: var(--t-button-border-color);
		text-decoration: none;
	}

	&[aria-busy='true'],
	&[aria-disabled='true'] {
		opacity: ${tokens.opacity.disabled};
	}

	&[aria-disabled='true'] {
		cursor: not-allowed;
	}

	&.btn--small {
		min-height: ${tokens.sizes.xl};

		.btn__loading,
		.btn__icon {
			+ .btn__text {
				margin-left: ${tokens.space.xs};
			}
		}

		&.btn--has-text {
			padding: ${tokens.space.none} ${tokens.space.s};
		}
	}
`;

ButtonBase.displayName = 'Button.Base';

export default ButtonBase;
