import React, { Component } from 'react';

class Canvas extends Component {
	constructor(props) {
		super(props);
		this.canvasRef = React.createRef();
		this.ctx = null;
		this.state = {
			drawable : false,
			X : -1,
			Y : -1
		};
		this.id = this.setId();
	}
	setId() {
		return btoa('canvas' + (Math.random() * new Date().getTime()));
	}

	componentDidMount() {
		this.ctx = this.canvasRef.current.getContext("2d");
		this.canvasRef.current.addEventListener("mousedown",this.initDraw);
		this.canvasRef.current.addEventListener("mousemove",this.draw);
		this.canvasRef.current.addEventListener("mouseup",this.finishDraw);
		//this.canvasRef.current.addEventListener("mouseout",this.finishDraw);
		this.ctx.strokeStyle = 'rgb(0,0,0)';
	}

	initDraw = (e) => {
		this.setState({
			drawable : true,
			X : e.offsetX,
			Y : e.offsetY,
		});
		this.ctx.beginPath();
		this.ctx.moveTo(this.state.X, this.state.Y);
	}
	
	draw = (e) => {
		if (this.state.drawable) {
			this.setState({
				X : e.offsetX,
				Y : e.offsetY,
			});
			this.ctx.lineTo(this.state.X, this.state.Y);
			this.ctx.stroke();
			console.log(this.state);
		}
	}
	
	finishDraw = () => {
		this.setState({
			drawable : false,
			X : -1,
			Y : -1
		});
	}

	render() {
		return (
			<canvas className="draw-canvas" ref={this.canvasRef} width="500px" height="500px"/>
		);
	}
}

export default Canvas;
