import React, { useState } from "react";
import PropTypes from "prop-types";

export default function About(props) {
	const [dstyles, setDStyles] = useState({
		color: "#FFFFFF",
		backgroundColor: "#1E1F38",
	});
	const [wstyles, setWStyles] = useState({
		color: "#000000",
		backgroundColor: "#FFFFFF",
	});

	return (
		<div className="accordion mx-4 my-5" id="accordionExample">
			<div className="accordion-item ">
				<h2 className="accordion-header " id="headingOne">
					<button
						className="accordion-button"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#collapseOne"
						aria-expanded="true"
						aria-controls="collapseOne"
						style={props.mode===0? wstyles : dstyles}
					>
						{props.abouttitle1}
					</button>
				</h2>
				<div
					id="collapseOne"
					className="accordion-collapse collapse"
					aria-labelledby="headingOne"
					data-bs-parent="#accordionExample"
				>
					<div
						className="accordion-body"
						style={props.mode===0? wstyles : dstyles}
					>
						{props.about1}
					</div>
				</div>
			</div>
			<div className="accordion-item ">
				<h2 className="accordion-header" id="headingTwo">
					<button
						className="accordion-button collapsed"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#collapseTwo"
						aria-expanded="false"
						aria-controls="collapseTwo"
						style={props.mode===0? wstyles : dstyles}
					>
						{props.abouttitle2}
					</button>
				</h2>
				<div
					id="collapseTwo"
					className="accordion-collapse collapse"
					aria-labelledby="headingTwo"
					data-bs-parent="#accordionExample"
				>
					<div
						className="accordion-body"
						style={props.mode===0? wstyles : dstyles}
					>
						{props.about2}
					</div>
				</div>
			</div>
			<div className="accordion-item ">
				<h2 className="accordion-header" id="headingThree">
					<button
						className="accordion-button collapsed"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#collapseThree"
						aria-expanded="false"
						aria-controls="collapseThree"
						style={props.mode===0? wstyles : dstyles}
					>
						{props.abouttitle3}
					</button>
				</h2>
				<div
					id="collapseThree"
					className="accordion-collapse collapse"
					aria-labelledby="headingThree"
					data-bs-parent="#accordionExample"
				>
					<div
						className="accordion-body"
						style={props.mode===0? wstyles : dstyles}
					>
						{props.about3}
					</div>
				</div>
			</div>
		</div>
	);
}
About.propTypes = {
	abouttitle1: PropTypes.string.isRequired,
	about1: PropTypes.string.isRequired,
	abouttitle2: PropTypes.string.isRequired,
	about2: PropTypes.string.isRequired,
	abouttitle3: PropTypes.string.isRequired,
	about3: PropTypes.string.isRequired,
};
