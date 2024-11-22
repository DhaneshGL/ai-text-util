import React from "react";

export default function Alert(props) {
	return (
		<div
			className="alert alert-success d-flex align-items-center alert-dismissible"
			role="alert"
		>
			<svg
				className="bi flex-shrink-0 me-2"
				width="24"
				height="24"
				role="img"
				aria-label="Success:"
			>
				<use xlinkHref="#check-circle-fill" />
			</svg>
			<div>{props.alertText}</div>
		</div>
	);
}

