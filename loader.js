const PARAM_SPLIT_SYM = ";";
const PARAM_ASSINGMENT_SYM = "=";

const baseParams = {
	appName: "3d",
	width: 800,
	height: 600,
	showMenuBar: true
};

const parserFeaturesMap = {
	apn: ["appName", "string"],
	w: ["width", "number"],
	h: ["height", "number"],
	id: ["material_id", "string"],
	bc: ["borderColor", "string"],
	br: ["borderRadius", "number"],
	erc: ["enableRightClick", "bool"],
	eld: ["enableLabelDrags", "bool"],
	esdz: ["enableShiftDragZoom", "bool"],
	szb: ["showZoomButtons", "bool"],
	eda: ["errorDialogsActive", "bool"],
	smb: ["showMenuBar", "bool"],
	stb: ["showToolBar", "bool"],
	ctb: ["customToolBar", "string"],
	sai: ["showAlgebraInput", "bool"],
	sri: ["showResetIcon", "bool"],
	lang: ["language", "string"],
	country: ["country", "string"],
	asb: ["allowStyleBar", "bool"],
	eur: ["enableUndoRedo", "bool"],
	pp: ["perspective", "string"],
	e3d: ["enable3d", "bool"],
	aip: ["algebraInputPosition", "string"],
	autoh: ["autoHeight", "bool"],
	pbtn: ["playButton", "bool"],
	sab: ["showAnimationButton", "bool"],
	sfb: ["showFullscreenButton", "bool"],
	ssb: ["showSuggestionButtons", "bool"],
	btnsh: ["buttonShadows", "bool"],
	btnrn: ["buttonRounding", "float"]
};

const getDefaultParams = id => {
	const params = JSON.parse(JSON.stringify(baseParams)) // Make a deep copy of 'baseParams' to avoid applet duplication
	if (id) params.material_id = id;
	return params;
}

const valToType = (val, paramType) => {
	switch (paramType) {
		case "string": return val;
		case "bool": return val === "true";
		case "number": return parseInt(val);
		case "float": return parseFloat(val);
	}
}

const parseGGBInfo = ggbInfo => {
	if (!ggbInfo) throw new Error("Invalid GGB info was given, you have to enter at least the activity ID");

	const params = ggbInfo.split(PARAM_SPLIT_SYM);
	if (params.length === 1) return getDefaultParams(ggbInfo);
	let ggbParamsObj = {};

	for (const param of params) {
		const [key, val] = param.split(PARAM_ASSINGMENT_SYM);

		if (!key) {
			console.warn("Invalid parameter entry, key missing.");
			continue;
		}

		if (!(key in parserFeaturesMap)) {
			console.warn(`GGB feature "${key}" is not a valid GeoGebra parameter`)
			continue;
		}

		const [paramName, type] = parserFeaturesMap[key];
		ggbParamsObj[paramName] = valToType(val, type);
	}

	ggbParamsObj = Object.assign(getDefaultParams(), ggbParamsObj);
	return ggbParamsObj;
};

window.addEventListener("load", () => {
	const ggbEmbeds = document.querySelectorAll("div.ggb");
	for (const embed of ggbEmbeds) {
		const params = parseGGBInfo(embed.id);
		const applet = new GGBApplet(params, true);
		applet.inject(embed.id);
	}
})
