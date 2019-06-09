var SITE_accordion = {
	config: {
		$accordion: $('.accordion'),
		$tab: $(".accordion__header"),
		$panel: $(".accordion__content")
	},

	init: function() {
		var _ = this;

		_.bindAria();
		_.initEvents();
	},

	bindAria: function() {
		var _ = this;

		$(_.config.$accordion).each(function(i){
			var $this = $(this);
			$this.attr('id', 'accordion_' + i);

			_.setAccordionAttributes($this,_.config.$tab,_.config.$panel, i);
		});
	},

	initEvents: function() {
		var _ = this;

		_.config.$tab.off().on('click keydown', function(e) {
			var $clickedTab = $(this);
			var $panel = _.config.$panel;

			$clickedTab.toggleClass('expanded');

			// click, enter, or spacebar
			// open/close the accordion tabs
			if ( e.type == 'click' || e.keyCode == 13 || e.keyCode == 32 ) {
				_.openSlide($clickedTab,$panel,'.accordion__plus');
			} 
			// left or up arrow keys
			// move focus to previous accordion tab
			else if ( e.keyCode == 37 || e.keyCode == 38 ) {
				_.goPrev($clickedTab);
			}
			// down or right arrow keys
			// move focus to next accordion tab
			else if ( e.keyCode == 39 || e.keyCode == 40 ) {
				_.goNext($clickedTab);
			}
		});

		_.config.$panel.off().on('keydown', function(e) {
			// CTRL + up arrow key
			// when in accordion panel, move focus to related accordion tab
			if ( e.keyCode == 38 && e.ctrlKey ) {
				_.goRelated($(this));
			}
		});
	},

	setAccordionAttributes: function($this,$tab,$panel, i) {
		$this
			.attr({
				'role': 'tablist',
				'multiselectable': 'true'
		});

		$this.find($tab).each(function(j){
			var $this = $(this);
			$this.attr({
				'id': 'a' + i + '_tab' + j,
				'role': 'tab',
				'tabindex': '0',
				'aria-expanded': 'false',
				'aria-controls': 'a' + i + '_panel' + j
			});
		})
			
		$this.find($panel).each(function(j){
			var $this = $(this);
			$this.attr({
				'id': 'a' + i + '_panel' + j,
				'role': 'tabpanel',
				'aria-hidden': 'true',
				'aria-labelledby': 'a' + i + '_tab' + j
			});
		})
	},

	setAriaVisible: function($clickedTab) {
		$clickedTab.attr('aria-expanded', 'true');
		$clickedTab.next('[aria-hidden=true]').attr('aria-hidden', 'false');
	},

	setAriaHidden: function($clickedTab) {
		$clickedTab.attr('aria-expanded', 'false');
		$clickedTab.next('[aria-hidden=false]').attr('aria-hidden', 'true');
	},

	openSlide: function(tab, panel, icon) {
		var _ = this;
		tab.next(panel).slideToggle(300);
		tab.children(icon).toggleClass('open');

		if ( tab.children(icon).hasClass('open') ){
			_.setAriaVisible(tab);
		} else {
			_.setAriaHidden(tab);
		}
	},

	goPrev: function(tab) {
		var $id = '#' + tab.parents('.accordion').attr('id') + ' .accordion__tab';
		var index = $($id).index(document.activeElement) - 1;
		if (index >= $($id).length) index = 0;
		$($id).eq(index).focus();
	},

	goNext: function(tab) {
		var $id = '#' + tab.parents('.accordion').attr('id') + ' .accordion__tab';
		var index = $($id).index(document.activeElement) + 1;
		if (index >= $($id).length) index = 0;
		$($id).eq(index).focus();
	},

	goRelated: function(sibling) {
		sibling.prev('.accordion__tab').focus();
	},		

	destroy: function() {
		var _ = this;

		_.config.$expandToggle
			.off('click.expandToggle')
			.removeClass('expanded');

		_.config.$expandToggle
			.parent()
			.removeClass('expanded')
			.find('ul:first')
			.removeAttr('style');
	}	
};

SITE_accordion.init();
