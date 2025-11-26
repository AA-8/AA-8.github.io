//We call this "being lazy". Enjoy your globally scoped "inRect".
function inRect(x,y,rect)
{
	//find out if the point x,y is in the rotated rectangle rect{w,h,r,o} (width,height,rotation in radians,y-origin) (needs to be normalized)
	//I found this somewhere online I guess
	var dx = x+Math.sin(-rect.r)*(-(rect.h/2-rect.o)),dy=y+Math.cos(-rect.r)*(-(rect.h/2-rect.o));
	var h1 = Math.sqrt(dx*dx + dy*dy);
	var currA = Math.atan2(dy,dx);
	var newA = currA - rect.r;
	var x2 = Math.cos(newA) * h1;
	var y2 = Math.sin(newA) * h1;
	if (x2 > -0.5 * rect.w && x2 < 0.5 * rect.w && y2 > -0.5 * rect.h && y2 < 0.5 * rect.h) return true;
	return false;
}

Game.registerMod("a16holidaytweaks",{
	init:function() {

		//
		// Instant Valentine's Day biscuits.
		//

		//Take original buy function of Lovesick biscuit:
		var ValentineSwitcher = String(Game.Upgrades["Lovesick biscuit"].buyFunction);
		//Insert if,else disaster that unlocks every heart biscuit you can immediately afford.
		Game.Upgrades["Lovesick biscuit"].buyFunction = eval("(" + ValentineSwitcher.replace("Game.season=this.season;","Game.season=this.season;\n\t\t\t\t\tif (Game.cookies > 1001001001001001001000000) {\n\t\t\t\t\t\tGame.Unlock('Prism heart biscuits');Game.Unlock('Eternal heart biscuits');Game.Unlock('Golden heart biscuits');Game.Unlock('Weeping heart biscuits');Game.Unlock('Sour heart biscuits');Game.Unlock('Ardent heart biscuits');Game.Unlock('Pure heart biscuits');\n\t\t\t\t\t} else\n\t\t\t\t\tif (Game.cookies > 1001001001001001000000) {\n\t\t\t\t\t\tGame.Unlock('Eternal heart biscuits');Game.Unlock('Golden heart biscuits');Game.Unlock('Weeping heart biscuits');Game.Unlock('Sour heart biscuits');Game.Unlock('Ardent heart biscuits');Game.Unlock('Pure heart biscuits');\n\t\t\t\t\t} else\n\t\t\t\t\tif (Game.cookies > 1001001001001000000) {\n\t\t\t\t\t\tGame.Unlock('Golden heart biscuits');Game.Unlock('Weeping heart biscuits');Game.Unlock('Sour heart biscuits');Game.Unlock('Ardent heart biscuits');Game.Unlock('Pure heart biscuits');\n\t\t\t\t\t} else\n\t\t\t\t\tif (Game.cookies > 1001001001000000) {\n\t\t\t\t\t\tGame.Unlock('Weeping heart biscuits');Game.Unlock('Sour heart biscuits');Game.Unlock('Ardent heart biscuits');Game.Unlock('Pure heart biscuits');\n\t\t\t\t\t} else\n\t\t\t\t\tif (Game.cookies > 1001001000000) {\n\t\t\t\t\t\tGame.Unlock('Sour heart biscuits');Game.Unlock('Ardent heart biscuits');Game.Unlock('Pure heart biscuits');\n\t\t\t\t\t} else\n\t\t\t\t\tif (Game.cookies > 1001000000) {\n\t\t\t\t\t\tGame.Unlock('Ardent heart biscuits');Game.Unlock('Pure heart biscuits');\n\t\t\t\t\t}") + ")");

		//
		// Chocolate Egg works with Permanent Upgrade.
		//

		//On reincarnation:
		Game.registerHook('reincarnate',
			function(){
				//If you have Chocolate egg:
				if ( Game.Has("Chocolate egg") ) {
					//Restore Chocolate egg to your upgrades.
					Game.Lock("Chocolate egg");
					Game.Unlock("Chocolate egg");

					//Clear notification.
					for (var i = 0; i < Game.Notes.length; i++) {
						if (Game.Notes[i].pic[0] == Game.Upgrades['Chocolate egg'].icon[0] &&
							Game.Notes[i].pic[1] == Game.Upgrades['Chocolate egg'].icon[1])
						{
							Game.CloseNote(i);
							//As best as I can tell, lag sometimes causes the note to not get closed.

							//Why?
							setTimeout(() => {if (Game.Notes[i] != undefined && Game.Notes[i].pic[0] == Game.Upgrades['Chocolate egg'].icon[0]) Game.CloseNote(i);} , 0);
							break;
						}
					}

					//Bonus: Vault Chocolate egg.
					if ( Game.Has('Inspired checklist') ) {
						Game.Upgrades["Chocolate egg"].vault();
						Game.upgradesToRebuild=1;
					}
				}
			}
		);

		//
		// All Easter achievements boost drop rate (up to their egg requirement).
		//

		var EggDrop = String(Game.DropEgg);
		EggDrop = EggDrop.replace("if (Game.HasAchiev('Hide & seek champion", "var eggs=0;\n\t\t\tfor (var i in Game.easterEggs) { if (Game.HasUnlocked(Game.easterEggs[i])) eggs++; }\n\t\t\tif (Game.HasAchiev('Egging on') && eggs < 8) failRate*=0.7;\n\t\t\tif (Game.HasAchiev('Mass Easteria') && eggs < 15) failRate*=0.7;\n\t\t\tif (Game.HasAchiev('Hide & seek champion");

		Game.DropEgg = eval("(" + EggDrop + ")");

		//Inform user of the egg drop rate boost. (Temporarily).
		Game.Achievements["Egging on"].ddesc += "<div class=\"line\"></div>Owning this achievement makes eggs drop more frequently <b>up to 7 eggs</b> in future playthroughs.";
		Game.Achievements["Mass Easteria"].ddesc += "<div class=\"line\"></div>Owning this achievement makes eggs drop more frequently <b>up to 14 eggs</b> in future playthroughs.";

		//
		// Halloween cookies can be obtained through Wrath Cookies.
		//

		//For maximum compatibility between mods: take the current script - and therefore any modifications made to it before this - and use that for Game.DropSpooky. 
		var WrinklerUpdate = String(Game.UpdateWrinklers);

		var HalloweenDropBegin = WrinklerUpdate.indexOf("if (Game.season=='halloween')");
		var SpookyDropFunctionBegin = WrinklerUpdate.indexOf("'Spooky cookies')) failRate=0.8",HalloweenDropBegin) + 32;
		var SpookyDropFunctionEnd = WrinklerUpdate.indexOf("\n\t\t\t\t\t\t}",SpookyDropFunctionBegin) + 8;
		var HalloweenDropEnd = SpookyDropFunctionEnd + 6;

		//Minor reformatting; changed Spooky Cookies to just multiply the failRate instead of setting it. Rest assured, the value is calculated to be (very closely approximately) the same as vanilla when popping wrinklers.
		var SpookyDropFunction = "function(failRate)\n{\t\t\t\t\t\t\tif (Game.season!='halloween') return\n\t\t\t\t\t\t\tif (Game.HasAchiev('Spooky cookies')) failRate *= 0.842105;\n\t\t\t\t\t\t" + WrinklerUpdate.slice(SpookyDropFunctionBegin,SpookyDropFunctionEnd);
		//"me" isn't going to exist outside of the wrinkler.
		SpookyDropFunction = SpookyDropFunction.replace("\t\t\t\t\t\t\tif (me.type==1) failRate*=0.9;","");

		Game.DropSpooky = eval("(" + SpookyDropFunction + ")");

		//It isn't technically necessary to replace the original script with the new DropSpooky function, but it would potentially, maybe, possibly make 1 person's life a bit easier.
		var WrinklerUpdateReplacement = WrinklerUpdate.slice(0,HalloweenDropBegin) + "var failRate = 0.95;\n\t\t\t\t\t\tif (me.type==1) failRate*=0.9;\n\t\t\t\t\t\tGame.DropSpooky(failRate);\n\t\t\t\t\t" + WrinklerUpdate.slice(HalloweenDropEnd);
		Game.UpdateWrinklers = eval("(" + WrinklerUpdateReplacement + ")");

		//Add DropSpooky to wrath cookies:
		var GoldenPop = String(Game.shimmerTypes["golden"].popFunc);
		GoldenPop = GoldenPop.replace("Game.DropEgg","Game.DropEgg(0.9);\n\t\t\t\t\tif (me.wrath>0) Game.DropSpooky");

		Game.shimmerTypes["golden"].popFunc = eval("(" + GoldenPop + ")");

	}
});

//Inform user of the egg drop rate boost. (Permanently).
ModLanguage('EN',{
	"[Achievement desc 167]Egging on": "Unlock <b>7 eggs</b>.<div class=\"line\"></div>Owning this achievement makes eggs drop more frequently <b>up to 7 eggs</b> in future playthroughs.",
	"[Achievement desc 168]Mass Easteria": "Unlock <b>14 eggs</b>.<div class=\"line\"></div>Owning this achievement makes eggs drop more frequently <b>up to 14 eggs</b> in future playthroughs."
});
