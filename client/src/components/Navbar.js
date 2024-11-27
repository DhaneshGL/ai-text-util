import React, { useState } from "react";
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';


export default function Navbar(props) {
	const [dstyles, setDStyles] = useState({
		backgroundColor: "#F0F0F0",
		padding: "0px",
		border: "4px solid #F0F0F0",
	});
	const [wstyles, setWStyles] = useState({
		backgroundColor: "#272841",
		padding: "0px",
		border: "4px solid #272841",
	});
	var l = {
		color: "#FFFFFF",
		padding: "0px",
		margin: "0x",
	};
	var d = {
		color: "#000000",
		padding: "0px",
		margin: "0x",
	};
	return (
		<nav
			className="navbar navbar-expand-lg bg-body-tertiary "
			style={props.mode===0? dstyles : wstyles}
		>{console.log(props.mode)}
			<div
				className="container-fluid "
				style={props.mode===0? dstyles : wstyles}
			>
				<a className="navbar-brand " href="#">
					<div style={props.mode===0? d : l}>{props.title}</div>
				</a>
				<button
					className="navbar-toggler "
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarNavAltMarkup"
					aria-controls="navbarNavAltMarkup"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span className="navbar-toggler-icon "></span>
				</button>
				<div className="collapse navbar-collapse" id="navbarNavAltMarkup">
					<div className="navbar-nav ">
						<Link
							className="nav-link active "
							aria-current="page"
							to="/"
						>
							<div style={props.mode===0? d : l}>Home</div>{" "}
						</Link>
						<Link
							className="nav-link active "
							aria-current="page"
							to="/form"
						>
							<div style={props.mode===0? d : l}>Tools</div>{" "}
						</Link>
						<Link
							className="nav-link "
							to="/About"
						>
							<div style={props.mode===0? d : l}>About</div>{" "}
						</Link>
						<Link
							className="nav-link "
							to="https://realtime-chat-8yzn.onrender.com"
						>
							<div style={props.mode===0? d : l}>Chat</div>{" "}
						</Link>
					</div>
				</div>
			</div>
		</nav>
	);
}
