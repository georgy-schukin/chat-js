'use strict';

process.on("message", function(data) {
	console.log("Child got message: " + data);
	var result = data;
	if (typeof data === "string" || data instanceof string) {
		result = data.toUpperCase();
	}
	process.send(result);
});
