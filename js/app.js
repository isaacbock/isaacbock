document.addEventListener("DOMContentLoaded", function (event) {
	// autoscroll down after intro video completion
	let introVideo = document.getElementById("intro_video");
	let bio = document.getElementById("bio");
	introVideo.onended = function () {
		setTimeout(function () {
			scrollIntoViewCustom(bio);
		}, 250);
	};
});

// mobile-accessible smooth scroll via Ricardo Rocha (https://stackoverflow.com/a/57676300)
function scrollIntoViewCustom(element) {
	let start = null;
	let target = element && element ? element.getBoundingClientRect().top : 0;
	let firstPos = window.pageYOffset || document.documentElement.scrollTop;
	let pos = 0;
	(function () {
		var browser = ["ms", "moz", "webkit", "o"];
		for (
			var x = 0, length = browser.length;
			x < length && !window.requestAnimationFrame;
			x++
		) {
			window.requestAnimationFrame =
				window[browser[x] + "RequestAnimationFrame"];
			window.cancelAnimationFrame =
				window[browser[x] + "CancelAnimationFrame"] ||
				window[browser[x] + "CancelRequestAnimationFrame"];
		}
	})();
	function showAnimation(timestamp) {
		if (!start) {
			start = timestamp || new Date().getTime();
		} //get id of animation
		var elapsed = timestamp - start;
		var progress = elapsed / 600; // animation duration 600ms
		//ease in function from https://github.com/component/ease/blob/master/index.js
		var outQuad = function outQuad(n) {
			return n * (2 - n);
		};
		var easeInPercentage = +outQuad(progress).toFixed(2); // if target is 0 (back to top), the position is: current pos + (current pos * percentage of duration)
		// if target > 0 (not back to top), the positon is current pos + (target pos * percentage of duration)
		pos =
			target === 0
				? firstPos - firstPos * easeInPercentage
				: firstPos + target * easeInPercentage;
		window.scrollTo(0, pos);
		if (
			(target !== 0 && pos >= firstPos + target) ||
			(target === 0 && pos <= 0)
		) {
			cancelAnimationFrame(start);
			if (element) {
				element.setAttribute("tabindex", -1);
				element.focus();
			}
			pos = 0;
		} else {
			window.requestAnimationFrame(showAnimation);
		}
	}
	window.requestAnimationFrame(showAnimation);
}

// there are 3 parts to this
//
// Scene:           Setups and manages threejs rendering
// loadModel:       Loads the 3d obj file
// setupAnimation:  Creates all the GSAP
//                  animtions and scroll triggers
//
// first we call loadModel, once complete we call
// setupAnimation which creates a new Scene

class Scene {
	constructor(model) {
		this.views = [
			{ bottom: 0, height: 1 },
			{ bottom: 0, height: 0 },
		];

		this.renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true,
		});

		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		this.renderer.setPixelRatio(window.devicePixelRatio);

		document.body.appendChild(this.renderer.domElement);

		// scene

		this.scene = new THREE.Scene();

		for (var ii = 0; ii < this.views.length; ++ii) {
			var view = this.views[ii];
			var camera = new THREE.PerspectiveCamera(
				45,
				window.innerWidth / window.innerHeight,
				1,
				2000
			);
			camera.position.fromArray([0, 0, 180]);
			camera.layers.disableAll();
			camera.layers.enable(ii);
			view.camera = camera;
			camera.lookAt(new THREE.Vector3(0, 5, 0));
		}

		//light

		this.light = new THREE.PointLight(0xffffff, 0.7);
		this.light.position.z = 150;
		this.light.position.x = 300;
		this.light.position.y = 200;
		this.scene.add(this.light);

		this.softLight = new THREE.AmbientLight(0xffffff, 1.5);
		this.scene.add(this.softLight);

		// group

		this.onResize();
		window.addEventListener("resize", this.onResize, false);

		var edges = new THREE.EdgesGeometry(model.children[0].geometry);

		var material = new THREE.LineBasicMaterial({
			color: 0x02a9f7,
		});

		let line = new THREE.LineSegments(edges, material);
		line.material.depthTest = false;
		line.material.opacity = 1;
		line.material.transparent = true;
		line.position.x = 0.5;
		line.position.z = -1;
		line.position.y = 0.2;

		this.modelGroup = new THREE.Group();

		model.layers.set(0);
		line.layers.set(1);

		this.modelGroup.add(model);
		this.modelGroup.add(line);
		this.scene.add(this.modelGroup);

		this.render = this.render.bind(this);
		this.onResize = this.onResize.bind(this);
	}

	render = () => {
		for (var ii = 0; ii < this.views.length; ++ii) {
			var view = this.views[ii];
			var camera = view.camera;

			var bottom = Math.floor(this.h * view.bottom);
			var height = Math.floor(this.h * view.height);

			this.renderer.setViewport(0, 0, this.w, this.h);
			this.renderer.setScissor(0, bottom, this.w, height);
			this.renderer.setScissorTest(true);

			camera.aspect = this.w / this.h;
			this.renderer.render(this.scene, camera);
		}
	};

	onResize = () => {
		this.w = window.innerWidth;
		this.h = window.innerHeight;

		for (var ii = 0; ii < this.views.length; ++ii) {
			var view = this.views[ii];
			var camera = view.camera;
			camera.aspect = this.w / this.h;
			let camZ = (screen.width - this.w * 1) / 3;
			camera.position.z = camZ < 180 ? 180 : camZ;
			camera.updateProjectionMatrix();
		}

		this.renderer.setSize(this.w, this.h);
		this.render();
	};
}

function loadModel() {
	gsap.registerPlugin(ScrollTrigger);

	var object;

	function onModelLoaded() {
		object.traverse(function (child) {
			let mat = new THREE.MeshPhongMaterial({
				color: 0x6e3545,
				shininess: 25,
				flatShading: true,
			});
			child.material = mat;
		});

		setupAnimation(object);
	}

	var manager = new THREE.LoadingManager(onModelLoaded);
	manager.onProgress = (item, loaded, total) =>
		console.log(item, loaded, total);

	var loader = new THREE.OBJLoader(manager);
	loader.load("/assets/Brain.obj", function (obj) {
		object = obj;
	});
}

function setupAnimation(model) {
	let scene = new Scene(model);
	let brain = scene.modelGroup;

	let tau = Math.PI * 2;

	gsap.set(brain.rotation, { x: 0, y: tau / 4, z: 0 });
	gsap.set(brain.scale, { x: 0.3, y: 0.3, z: 0.3 });
	gsap.set(brain.position, { x: 30, y: -50, z: 140 });

	scene.render();

	var sectionDuration = 0.9;

	// wireframe to solid
	gsap.fromTo(
		scene.views[1],
		{ height: 1, bottom: 0 },
		{
			height: 0,
			bottom: 1,
			ease: "none",
			scrollTrigger: {
				trigger: ".blueprint",
				scrub: true,
				start: "top 65%",
				end: "top 0",
			},
		}
	);

	let tl = new gsap.timeline({
		onUpdate: scene.render,
		scrollTrigger: {
			trigger: ".three-dimensional",
			scrub: true,
			start: "top bottom",
			end: "bottom bottom",
		},
		defaults: { duration: sectionDuration, ease: "power2.inOut" },
	});

	let delay = 0;

	tl.to("canvas", { duration: 1, x: "0", autoAlpha: 1 }, delay);
	tl.to(brain.position, { duration: 1, x: 15, z: 140, ease: "none" }, delay);

	delay += 0.5 * sectionDuration;

	tl.to(brain.position, { x: 0, y: -20, z: -60, ease: "power1.inOut" }, delay);
	tl.to(
		brain.rotation,
		{ x: tau * 0.25, y: tau * -0.25, z: 0, ease: "power1.inOut" },
		delay
	);

	delay += sectionDuration;

	tl.to(
		brain.position,
		{
			duration: 0.5 * sectionDuration,
			x: 0,
			y: 00,
			z: -200,
			ease: "power1.in",
		},
		delay
	);
	tl.to(brain.rotation, { x: 0, y: 0, z: 0, ease: "power1.inOut" }, delay);

	delay += 0.5 * sectionDuration;

	tl.to("canvas", { duration: 0.1, x: "0", autoAlpha: 0 }, delay);

	gsap.from("#phone_brain", {
		y: -100,
		scale: 0.9,
		opacity: 0,
		duration: 0.5,
		scrollTrigger: {
			trigger: "#phone_container",
			start: "top 25%",
			end: "top 10%",
			toggleActions: "restart none none reset",
		},
	});

	gsap
		.timeline({
			scrollTrigger: {
				trigger: "#phone_container",
				start: "top 25%",
				end: "top top",
				toggleActions: "restart none none reset",
			},
		})
		.from(
			"#phone_bubble_1",
			{ x: 30, opacity: 0, ease: "back", duration: 0.75 },
			"-=.5"
		)
		.from(
			"#phone_bubble_2",
			{ x: 30, opacity: 0, ease: "back", duration: 0.75 },
			"-=.5"
		)
		.from(
			"#phone_bubble_3",
			{ x: 30, opacity: 0, ease: "back", duration: 0.75 },
			"-=.5"
		);

	gsap
		.timeline({
			scrollTrigger: {
				trigger: "#phone_container",
				start: "bottom bottom",
				end: "bottom 70%",
				pin: true,
				scrub: true,
				toggleActions: "restart none none reset",
			},
		})
		.to("#phone", { x: -400, duration: 1 }, ">");

	gsap
		.timeline({
			scrollTrigger: {
				trigger: "#phone_container",
				start: "bottom 85%",
				end: "bottom 85%",
				toggleActions: "restart none none reset",
			},
		})
		.from("#created_for_heading", { opacity: 0, x: 100, duration: 0.5 }, ">")
		.from(
			"#created_for_invisibly",
			{ opacity: 0, scale: 0.8, x: 50, duration: 0.5 },
			">"
		)
		.from(
			"#created_for_blb",
			{ opacity: 0, scale: 0.8, x: 50, duration: 0.5 },
			"-=.3"
		)
		.from(
			"#created_for_chrome",
			{ opacity: 0, scale: 0.8, x: 50, duration: 0.5 },
			"-=.3"
		)
		.from(
			"#presented_to_heading",
			{ opacity: 0, x: 100, duration: 0.5 },
			"-=.8"
		)
		.from(
			"#presented_to_disney",
			{ opacity: 0, scale: 0.8, x: 50, duration: 0.5 },
			"-=.3"
		)
		.from(
			"#presented_to_warner",
			{ opacity: 0, scale: 0.8, x: 50, duration: 0.5 },
			"-=.3"
		)
		.from(
			"#presented_to_lionsgate",
			{ opacity: 0, scale: 0.8, x: 50, duration: 0.5 },
			"-=.3"
		);
}

loadModel();
