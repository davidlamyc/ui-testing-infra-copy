export default (type, page) => {
	const url = (type === "url") ? page : browser.options.baseUrl + page;
	browser.url(url);
};
