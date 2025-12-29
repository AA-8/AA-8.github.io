Game.registerMod("a16showunearneddescriptions", {
	init:function() {
		/*
			WARNING!
			Spoilers.
		*/

		//Conditions for hiding certain descriptions:

		//
		// Cursor
		//

		Game.AchievementsById[34].descriptionCondition = //"Click"
			function() {
				return false; //Never show this description before earning it.
			};
		var i = [35,36,37,38,147,148,246,398,474,493,641,642,134,189,293];
		for (var ii = 0; ii < 15; ii++) {
			Game.AchievementsById[i[ii]].descriptionCondition = 
				function() {
					return Game.HasAchiev("Click");
				};
		}

		Game.AchievementsById[307].descriptionCondition = //"Freaky jazz hands"
			function() {
				return Game.HasAchiev("Click") && Game.lumpsTotal > 0;
			};

		//
		// Grandma
		//

		Game.AchievementsById[40].descriptionCondition = //"Grandma's cookies"
			function() {
				return false; //Never show this description before earning it.
			};
		var i = [39,81,431,248,41,42,101,102,149,208,209,338,339,340,399,475,556,618,135,190,294];
		for (var ii = 0; ii < 21; ii++) {
			Game.AchievementsById[i[ii]].descriptionCondition = 
				function() {
					return Game.HasAchiev("Grandma's cookies");
				};
		}

		Game.AchievementsById[308].descriptionCondition = //"Methuselah"
			function() {
				return Game.HasAchiev("Grandma's cookies") && Game.lumpsTotal > 0;
			};

		//
		// Farm
		//

		Game.AchievementsById[43].descriptionCondition = //"Bought the farm"
			function() {
				return false; //Never show this description before earning it.
			};
		var i = [44,45,115,150,210,250,281,341,354,400,476,494,557,619,136,191,295];
		for (var ii = 0; ii < 17; ii++) {
			Game.AchievementsById[i[ii]].descriptionCondition = 
				function() {
					return Game.HasAchiev("Bought the farm");
				};
		}

		Game.AchievementsById[309].descriptionCondition = //"Huge tracts of land"
			function() {
				return Game.HasAchiev("Bought the farm") && Game.lumpsTotal > 0;
			};

		//
		// Mine
		//

		Game.AchievementsById[49].descriptionCondition = //"You know the drill"
			function() {
				return false; //Never show this description before earning it.
			};
		var i = [50,51,117,152,211,251,282,342,355,401,477,495,558,620,137,192,296];
		for (var ii = 0; ii < 17; ii++) {
			Game.AchievementsById[i[ii]].descriptionCondition = 
				function() {
					return Game.HasAchiev("You know the drill");
				};
		}

		Game.AchievementsById[310].descriptionCondition = //"D-d-d-d-deeper"
			function() {
				return Game.HasAchiev("You know the drill") && Game.lumpsTotal > 0;
			};

		//
		// Factory
		//

		Game.AchievementsById[46].descriptionCondition = //"Production chain"
			function() {
				return false; //Never show this description before earning it.
			};
		var i = [47,48,116,151,212,252,283,343,356,402,478,496,559,621,138,193,297];
		for (var ii = 0; ii < 17; ii++) {
			Game.AchievementsById[i[ii]].descriptionCondition = 
				function() {
					return Game.HasAchiev("Production chain");
				};
		}

		Game.AchievementsById[311].descriptionCondition = //"Patently genius"
			function() {
				return Game.HasAchiev("Production chain") && Game.lumpsTotal > 0;
			};

		//
		// Bank
		//

		Game.AchievementsById[171].descriptionCondition = //"Pretty penny"
			function() {
				return false; //Never show this description before earning it.
			};
		var i = [172,173,174,175,213,253,284,344,357,403,479,497,560,622,186,194,298];
		for (var ii = 0; ii < 17; ii++) {
			Game.AchievementsById[i[ii]].descriptionCondition = 
				function() {
					return Game.HasAchiev("Pretty penny");
				};
		}

		Game.AchievementsById[312].descriptionCondition = //"A capital idea"
			function() {
				return Game.HasAchiev("Pretty penny") && Game.lumpsTotal > 0;
			};

		//
		// Temple
		//

		Game.AchievementsById[176].descriptionCondition = //"Your time to shrine"
			function() {
				return false; //Never show this description before earning it.
			};
		var i = [177,178,179,180,214,254,285,345,358,404,480,498,561,623,187,195,299];
		for (var ii = 0; ii < 17; ii++) {
			Game.AchievementsById[i[ii]].descriptionCondition = 
				function() {
					return Game.HasAchiev("Your time to shrine");
				};
		}

		Game.AchievementsById[313].descriptionCondition = //"It belongs in a bakery"
			function() {
				return Game.HasAchiev("Your time to shrine") && Game.lumpsTotal > 0;
			};

		//
		// Wizard tower
		//

		Game.AchievementsById[181].descriptionCondition = //"Bewitched"
			function() {
				return false; //Never show this description before earning it.
			};
		var i = [182,183,184,185,215,255,286,346,359,405,481,499,562,624,188,196,300];
		for (var ii = 0; ii < 17; ii++) {
			Game.AchievementsById[i[ii]].descriptionCondition = 
				function() {
					return Game.HasAchiev("Bewitched");
				};
		}

		Game.AchievementsById[314].descriptionCondition = //"Motormouth"
			function() {
				return Game.HasAchiev("Bewitched") && Game.lumpsTotal > 0;
			};

		//
		// Shipment
		//

		Game.AchievementsById[52].descriptionCondition = //"Expedition"
			function() {
				return false; //Never show this description before earning it.
			};
		var i = [53,54,118,153,216,256,287,347,360,406,482,500,563,625,139,197,301];
		for (var ii = 0; ii < 17; ii++) {
			Game.AchievementsById[i[ii]].descriptionCondition = 
				function() {
					return Game.HasAchiev("Expedition");
				};
		}

		Game.AchievementsById[315].descriptionCondition = //"Been there done that"
			function() {
				return Game.HasAchiev("Expedition") && Game.lumpsTotal > 0;
			};

		//
		// Alchemy lab
		//

		Game.AchievementsById[55].descriptionCondition = //"Transmutation"
			function() {
				return false; //Never show this description before earning it.
			};
		var i = [56,57,119,154,217,257,288,348,361,407,483,501,564,626,140,198,302];
		for (var ii = 0; ii < 17; ii++) {
			Game.AchievementsById[i[ii]].descriptionCondition = 
				function() {
					return Game.HasAchiev("Transmutation");
				};
		}

		Game.AchievementsById[316].descriptionCondition = //"Phlogisticated substances"
			function() {
				return Game.HasAchiev("Transmutation") && Game.lumpsTotal > 0;
			};

		//
		// Portal
		//

		Game.AchievementsById[58].descriptionCondition = //"A whole new world"
			function() {
				return false; //Never show this description before earning it.
			};
		var i = [59,60,120,155,218,258,289,349,362,408,484,502,565,627,141,199,303];
		for (var ii = 0; ii < 17; ii++) {
			Game.AchievementsById[i[ii]].descriptionCondition = 
				function() {
					return Game.HasAchiev("A whole new world");
				};
		}

		Game.AchievementsById[317].descriptionCondition = //"Bizarro world"
			function() {
				return Game.HasAchiev("A whole new world") && Game.lumpsTotal > 0;
			};

		//
		// Time machine
		//

		Game.AchievementsById[61].descriptionCondition = //"Time warp"
			function() {
				return false; //Never show this description before earning it.
			};
		var i = [62,63,121,156,219,259,290,350,363,409,485,503,566,628,142,200,304];
		for (var ii = 0; ii < 17; ii++) {
			Game.AchievementsById[i[ii]].descriptionCondition = 
				function() {
					return Game.HasAchiev("Time warp");
				};
		}

		Game.AchievementsById[318].descriptionCondition = //"The long now"
			function() {
				return Game.HasAchiev("Time warp") && Game.lumpsTotal > 0;
			};

		//
		// Antimatter condenser
		//

		Game.AchievementsById[87].descriptionCondition = //"Antibatter"
			function() {
				return false; //Never show this description before earning it.
			};
		var i = [88,89,122,157,220,260,291,351,364,410,486,504,567,629,143,201,305];
		for (var ii = 0; ii < 17; ii++) {
			Game.AchievementsById[i[ii]].descriptionCondition = 
				function() {
					return Game.HasAchiev("Antibatter");
				};
		}

		Game.AchievementsById[319].descriptionCondition = //"Chubby hadrons"
			function() {
				return Game.HasAchiev("Antibatter") && Game.lumpsTotal > 0;
			};

		//
		// Prism
		//

		Game.AchievementsById[123].descriptionCondition = //"Lone photon"
			function() {
				return false; //Never show this description before earning it.
			};
		var i = [124,125,126,158,221,261,292,352,365,411,487,505,568,630,144,202,306];
		for (var ii = 0; ii < 17; ii++) {
			Game.AchievementsById[i[ii]].descriptionCondition = 
				function() {
					return Game.HasAchiev("Lone photon");
				};
		}

		Game.AchievementsById[320].descriptionCondition = //"Pavartable"
			function() {
				return Game.HasAchiev("Lone photon") && Game.lumpsTotal > 0;
			};

		//
		// Chancemaker
		//

		Game.AchievementsById[325].descriptionCondition = //"Lucked out"
			function() {
				return false; //Never show this description before earning it.
			};
		var i = [326,327,328,329,330,331,332,353,366,412,488,506,569,631,333,334,335];
		for (var ii = 0; ii < 17; ii++) {
			Game.AchievementsById[i[ii]].descriptionCondition = 
				function() {
					return Game.HasAchiev("Lucked out");
				};
		}

		Game.AchievementsById[336].descriptionCondition = //"Let's leaf it at that"
			function() {
				return Game.HasAchiev("Lucked out") && Game.lumpsTotal > 0;
			};

		//
		// Fractal engine
		//

		Game.AchievementsById[413].descriptionCondition = //"Self-contained"
			function() {
				return false; //Never show this description before earning it.
			};
		var i = [414,415,416,417,418,419,420,421,422,423,489,507,570,632,424,425,426];
		for (var ii = 0; ii < 17; ii++) {
			Game.AchievementsById[i[ii]].descriptionCondition = 
				function() {
					return Game.HasAchiev("Self-contained");
				};
		}

		Game.AchievementsById[427].descriptionCondition = //"Sierpinski rhomboids"
			function() {
				return Game.HasAchiev("Self-contained") && Game.lumpsTotal > 0;
			};

		//
		// Javascript console
		//

		Game.AchievementsById[433].descriptionCondition = //"F12"
			function() {
				return false; //Never show this description before earning it.
			};
		var i = [434,435,436,437,438,439,440,441,442,443,490,508,571,633,444,445,446];
		for (var ii = 0; ii < 17; ii++) {
			Game.AchievementsById[i[ii]].descriptionCondition = 
				function() {
					return Game.HasAchiev("F12");
				};
		}

		Game.AchievementsById[447].descriptionCondition = //"Alexandria"
			function() {
				return Game.HasAchiev("F12") && Game.lumpsTotal > 0;
			};

		//
		// Idleverse
		//

		Game.AchievementsById[509].descriptionCondition = //"They'll never know what hit 'em"
			function() {
				return false; //Never show this description before earning it.
			};
		var i = [510,511,512,513,514,515,516,517,518,519,520,521,572,634,522,523,524];
		for (var ii = 0; ii < 17; ii++) {
			Game.AchievementsById[i[ii]].descriptionCondition = 
				function() {
					return Game.HasAchiev("They'll never know what hit 'em");
				};
		}

		Game.AchievementsById[525].descriptionCondition = //"Strange topologies"
			function() {
				return Game.HasAchiev("They'll never know what hit 'em") && Game.lumpsTotal > 0;
			};

		//
		// Cortex baker
		//

		Game.AchievementsById[539].descriptionCondition = //"It's big brain time"
			function() {
				return false; //Never show this description before earning it.
			};
		var i = [540,541,542,543,544,545,546,547,548,549,550,551,573,635,552,553,554];
		for (var ii = 0; ii < 17; ii++) {
			Game.AchievementsById[i[ii]].descriptionCondition = 
				function() {
					return Game.HasAchiev("It's big brain time");
				};
		}

		Game.AchievementsById[555].descriptionCondition = //"Gifted"
			function() {
				return Game.HasAchiev("It's big brain time") && Game.lumpsTotal > 0;
			};

		//
		// You
		//

		Game.AchievementsById[600].descriptionCondition = //"My own clone"
			function() {
				return false; //Never show this description before earning it.
			};
		var i = [601,602,603,604,605,606,607,608,609,610,611,612,613,636,614,615,616,597];
		for (var ii = 0; ii < 18; ii++) {
			Game.AchievementsById[i[ii]].descriptionCondition = 
				function() {
					return Game.HasAchiev("My own clone");
				};
		}

		Game.AchievementsById[617].descriptionCondition = //"Self-improvement"
			function() {
				return Game.HasAchiev("My own clone") && Game.lumpsTotal > 0;
			};

		//
		// Golden Cookie
		//

		Game.AchievementsById[67].descriptionCondition = //"Golden cookie"
			function() {
				return false; //Never show this description before earning it.
			};

		var i = [68,69,77,84,85,263,264,324,491];
		for (var ii = 0; ii < 9; ii++) {
			Game.AchievementsById[i[ii]].descriptionCondition = 
				function() {
					return Game.HasAchiev("Golden cookie");
				};
		}

		//
		// Grandmapocalypse
		//

		Game.AchievementsById[594].descriptionCondition = //"Grandmapocalypse"
			function() {
				return false; //Never show this description before earning it.
			};
		Game.AchievementsById[595].descriptionCondition = //"Wrath cookie"
			function() {
				return false; //Never show this description before earning it.
			};
		Game.AchievementsById[79].descriptionCondition = //"Elder nap"
			function() {
				return false; //Never show this description before earning it.
			};
		var i = [80,82]; //Covenant related achievements.
		for (var ii = 0; ii < 2; ii++) {
			Game.AchievementsById[i[ii]].descriptionCondition = 
				function() {
					return Game.HasAchiev("Elder nap");
				};
		}
		Game.AchievementsById[105].descriptionCondition = //"Itchscratcher"
			function() {
				return false; //Never show this description before earning it.
			};
		var i = [598,106,107]; //Wrinkler popping related achievements.
		for (var ii = 0; ii < 3; ii++) {
			Game.AchievementsById[i[ii]].descriptionCondition = 
				function() {
					return Game.HasAchiev("Itchscratcher");
				};
		}

		//
		// Sugar Lumps
		//

		var i = [266,267,268,269,270,271,272,396];
		for (var ii = 0; ii < 8; ii++) {
			Game.AchievementsById[i[ii]].descriptionCondition = 
				function() {
					return Game.lumpsTotal > 0;
				};
		}

		//
		// Christmas
		//

		var i = [109,110,111,112,113,114,580];
		for (var ii = 0; ii < 7; ii++) {
			Game.AchievementsById[i[ii]].descriptionCondition = 
				function() {
					return Game.season == "christmas" || Game.HasUnlocked("Season switcher");
				};
		}
		Game.AchievementsById[265].descriptionCondition = //"Eldeer"
			function() {
				return ( Game.season == "christmas" || Game.HasUnlocked("Season switcher") ) && Game.HasAchiev("Grandmapocalypse");
			};

		//
		// Halloween
		//

		Game.AchievementsById[108].descriptionCondition = //"Spooky cookies"
			function() {
				return Game.season == "halloween" || Game.HasUnlocked("Season switcher");
			};

		//
		// Valentine's
		//

		Game.AchievementsById[130].descriptionCondition = //"Lovely cookies"
			function() {
				return Game.season == "valentines" || Game.HasUnlocked("Season switcher");
			};

		//
		// Easter
		//

		for (var i = 166; i < 170; i++) {
			Game.AchievementsById[i].descriptionCondition = 
				function() {
					return Game.season == "easter" || Game.HasUnlocked("Season switcher");
				};
		}

		//
		// Ascension
		//

		var i = [29,588,203,205,206,26,27,28,86,161,162,163,164,165,249,383,384,385,386,387,454,455,596,92,103,207,397,93,94,95,78,367]; //(This is a separate category from "Ascension Upgrade related" achievements).
		for (var ii = 0; ii < 32; ii++) {
			Game.AchievementsById[i[ii]].descriptionCondition = 
				function() {
					return Game.prestige > 0;
				};
		}

		Game.AchievementsById[432].descriptionCondition = //"Thick-skinned"
			function() {
				return Game.HasUnlocked("Shimmering veil");
			};
		Game.AchievementsById[222].descriptionCondition = //"Here be dragon"
			function() {
				return Game.HasUnlocked("How to bake your dragon");
			};
		Game.AchievementsById[589].descriptionCondition = //"No time like the present"
			function() {
				return Game.HasUnlocked("Wrapping paper");
			};
		Game.AchievementsById[456].descriptionCondition = //"O Fortuna"
			function() {
				return Game.HasUnlocked("Fortune cookies");
			};

		//
		// Minigames
		//

		for (var i = 321; i < 324; i++) { //Grimroire related achievements.
			Game.AchievementsById[i].descriptionCondition = 
				function() {
					return Game.Objects["Wizard tower"].level > 0;
				};
		}

		for (var i = 378; i < 382; i++) { //Garden related upgrades.
			Game.AchievementsById[i].descriptionCondition = 
				function() {
					return Game.Objects["Farm"].level > 0;
				};
		}
		Game.AchievementsById[382].descriptionCondition = //"Seedless to nay" (Separated to avoid spoiling end-of-garden reward).
			function() {
				return false; //Never show this description before earning it.
			};

		var i = [457,458,459,460,461,462,464,537,637,463]; //Stock Market related achievements.
		for (var ii = 0; ii < 9; ii++) {
			Game.AchievementsById[i[ii]].descriptionCondition = 
				function() {
					return Game.Objects["Bank"].level > 0;
				};
		}

		//
		// The End. (Miscellaneous).
		//

		Game.AchievementsById[465].descriptionCondition = //"Jellicles"
			function() {
				return Game.AchievementsOwned > 24; //Earn 25 achievements. (1 kitten's worth of achievements).
			};
		Game.AchievementsById[133].descriptionCondition = //"You win a cookie"
			function() {
				return false; //Never show this description before earning it.
			};
		Game.AchievementsById[639].descriptionCondition = //"Cookie Clicker"
			function() {
				return false; //Never show this description before earning it.
			};

		//Alter the crateTooltip function to display descriptions given the above conditions (are not true).
		var CrateTooltipFunction = String(Game.crateTooltip);
		CrateTooltipFunction = CrateTooltipFunction.replace("!mysterious) ariaText+='Description:"," !mysterious || ( me.descriptionCondition == null || me.descriptionCondition() ) ) ariaText+='Description:");
		CrateTooltipFunction = CrateTooltipFunction.replace("mysterious?'???':desc"," !mysterious || ( me.descriptionCondition == null || me.descriptionCondition() ) ? desc : '???' ");

		Game.crateTooltip = eval("(" + CrateTooltipFunction + ")");

		//Bonus: alter Game.crate to display all (non-dungeon) achievements.
		var CrateFunction = String(Game.crate);
		CrateFunction = CrateFunction.replaceAll("me.pool!='normal'","me.pool=='dungeon'");

		Game.crate = eval("(" + CrateFunction + ")");

	}
});
