const Notes = (function () {

//add note button
const initStickies = function initStickies() {
	$("<div />", { 
		text : "+", 
		"class" : "add-sticky",
		click : function () { createSticky(); }
	}).prependTo(document.body);
	initStickies = null;
},

//load localStorage
openStickies = function openStickies() {
	initStickies && initStickies();
	for (let i = 0; i < localStorage.length; i++) {
		createSticky(JSON.parse(localStorage.getItem(localStorage.key(i))));
	}
},

//create note
createSticky = function createSticky(data) {
	data = data || { id : +new Date(), top : "60px", left : "60px", text : "Note Here" }
	
	return $("<div />", { 
		"class" : "sticky",
		'id' : data.id
			})
		.prepend($("<div />", { "class" : "sticky-header"} )
			.append($("<span />", { 
				"class" : "sticky-status", 
				click : saveSticky 
			}))
			.append($("<span />", { 
				"class" : "close-sticky", 
				text : "x", 
				click : function () { deleteSticky($(this).parents(".sticky").attr("id")); }
			}))
		)
		.append($("<div />", { 
			html : data.text, 
			contentEditable : true, 
			"class" : "sticky-content", 
			keypress : markUnsaved
		}))
	.draggable({ 
		handle : "div.sticky-header", 
		stack : ".sticky",
		start : markUnsaved,
		stop  : saveSticky	
		})
	.css({
		position: "absolute",
		"top" : data.top,
		"left": data.left
	})
	.focusout(saveSticky)
	.appendTo(document.body);
},

//delete note
deleteSticky = function deleteSticky(id) {
	localStorage.removeItem("sticky-" + id);
	$("#" + id).fadeOut(200, function () { $(this).remove(); });
},

//save note to localStorage
saveSticky = function saveSticky() {
	const that = $(this),  sticky = (that.hasClass("sticky-status") || that.hasClass("sticky-content")) ? that.parents('div.sticky'): that,
			obj = {
				id  : sticky.attr("id"),
				top : sticky.css("top"),
				left: sticky.css("left"),
				text: sticky.children(".sticky-content").html()				}
	localStorage.setItem("sticky-" + obj.id, JSON.stringify(obj));	
	sticky.find(".sticky-status").text("saved");
},

//unsaved note marker
markUnsaved = function markUnsaved() {
	const that = $(this), sticky = that.hasClass("sticky-content") ? that.parents("div.sticky") : that;
	sticky.find(".sticky-status").text("unsaved");
}

return {
	open   : openStickies,
	init   : initStickies,
	"new"  : createSticky,
	remove : deleteSticky 
};
		
}());
