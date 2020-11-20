import React, { Component } from 'react';
import socketio from 'socket.io-client';

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
		this.socket = null;
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
		this.socket = socketio.connect('http://localhost:3001');
		this.socket.on('drawing', (obj) => {
			if (obj.id != this.id) {
				this.ctx.beginPath();
				this.ctx.moveTo(obj.x0, obj.y0);
				this.ctx.lineTo(obj.x1, obj.y1);
				this.ctx.stroke();
				this.ctx.closePath();
			}
		});
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
			this.ctx.lineTo(e.offsetX, e.offsetY);
			this.socket.emit('draw', { id : this.id, x0:this.state.X, y0:this.state.Y, x1:e.offsetX, y1:e.offsetY});
			this.setState({
				X : e.offsetX,
				Y : e.offsetY,
			});
			this.ctx.stroke();
		}
	}
	
	finishDraw = () => {
		this.ctx.closePath();
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
