var tempVARforBoardWriting1 = 0;
var tempVARforBoardWriting2 = 0;

//CPU related variables. Obviously.
var CPUCurrentBoard = [];
var CPUWriteableBoard = [];

var CPUOriginalTeam;

var CPUCurrentMoveWeight = 0;
var CPUBestMoveWeight = [];
var CPUBestSummed = -100;

var CPUIsSpecialMove = 0; //0 - No. | 1 - Duplicator summoning ritual. | 2 - Pastafarian bridge.

var CPUMoveHistory = [];
var CPUpossibleMoves = [];

var CPUDecision = 0;

//Unused.
var CPUDepth = 0; //Measured in turns.
var CPUDesiredDepth = 6;

	function AI_Apply_Weight(base, destination) {

		CPUCurrentMoveWeight = 0;

		//Summoning ritual.
		if (CPUIsSpecialMove == 1) {

			CPUCurrentMoveWeight += 0.25;

		} else {

		//Pushing forwards.
		if (current == -1) {
			CPUCurrentMoveWeight += (destination - base) / 1000;
		} else {
			CPUCurrentMoveWeight += (base - destination) / 1000;
		}
		
		//Capture.
		if (CPUWriteableBoard[destination][1] == notcurrentClass) {

			switch ( CPUWriteableBoard[destination][0] ) {

				case "Duplicate":
					CPUCurrentMoveWeight += 0.25;
					break;
				case "Skater":
				case "Child":
					CPUCurrentMoveWeight += 1.5;
					break;
				case "Lizard":
				case "Student":
					CPUCurrentMoveWeight += 2;
					break;
				case "Gentleman":
				case "Bunny":
				case "Pastafarian":
				case "broken3":
				case "broken2":
				case "broken1":
					CPUCurrentMoveWeight += 2.5;
					break;
				case "Duplicator":
					CPUCurrentMoveWeight += 4;
					break;
				case "Runner":
				case "Angel":
					if (current == 1) {
						if (VitalPieces[1] == 1) {
							CPUCurrentMoveWeight += 100;
						} else {
							CPUCurrentMoveWeight += 5;
						}
					} else {
						if (VitalPieces[0] == 1) {
							CPUCurrentMoveWeight += 100;
						} else {
							CPUCurrentMoveWeight += 5;
						}
					}
					break;

			}
		
		}

		}

		//Compare to previous best.
		if (CPUCurrentMoveWeight >= CPUBestMoveWeight[0]) {

			CPUBestMoveWeight[0] = CPUCurrentMoveWeight;

			switch (CPUIsSpecialMove) {

				case 0: //Default move.
				case 1: //Summoning ritual.
					CPUMoveHistory[0] = [base, destination];
					break;
				case 2: //Lightbridge.
					CPUMoveHistory[0] = [(base + 1) * 90, destination];
					break;

			}

		}
		
		if (current == CPUOriginalTeam) {

			//Update the AI's view of the board - enabling it to visualize responses.
			switch (CPUIsSpecialMove) {

				case 0: //Default move.
					CPUWriteableBoard[destination] = CPUWriteableBoard[base];
					CPUWriteableBoard[base] = [0];
					
					CPUMoveHistory[0] = [base, destination];
					break;
				case 1: //Summoning ritual. TO-DO: If I make this work more than a move ahead, make sure it keeps updating the amount of duplicates.
					CPUWriteableBoard[destination] = ["Duplicate", currentClass];

					CPUMoveHistory[0] = [88, destination];

					CPUIsSpecialMove = 0;
					break;
				case 2: //Lightbridge. TO-DO: Reduce the broken state of these hypothetical Pastafarians so the AI knows it regenerates.
					//Only do the TO-DO if I ever make this AI work more than a move ahead.
					CPUWriteableBoard[destination] = ["broken2", currentClass];
					CPUWriteableBoard[base] = [0];
					
					CPUMoveHistory[0] = [(base + 1) * 90, destination];

					CPUIsSpecialMove = 0;
					break;

			}

			//Switch teams to view opponent's possible responses.
			current = -1 * current;
			currentClass = "_" + current;
			notcurrentClass = "_" + current * -1;

			AI_Player();
			return;

		}
		CPUIsSpecialMove = 0;

	}

/*Check move. Weight = (Destination - Current tile) / 1000. Check if it captures anything. Apply the appropriate weight for what it captures.
  Apply same process for enemy pieces. Compare resulting score to highest seen. If it's higher, clear PossibleMoves and push current move.*/
	//Priority: Free capture > Good Trade > Move From Danger (Capture > Move) > Push
	function AI_Player() {

		CPUBestMoveWeight.unshift(-110);
		CPUMoveHistory.unshift(0);

		for (let TileToInvestigate = 0; TileToInvestigate < CPUWriteableBoard.length; TileToInvestigate++) {

			if ( CPUWriteableBoard[TileToInvestigate][0] != 0 && CPUWriteableBoard[TileToInvestigate][1] == currentClass ) {

				let horizontaloffset = (TileToInvestigate % 10) % 2;
				let startinglane = TileToInvestigate - (TileToInvestigate % 10);

				switch ( CPUWriteableBoard[TileToInvestigate][0] ) {

					case "Runner":
					//Jog
						//Rightwards
						for (let i = 1; ( TileToInvestigate + i ) < ( 10 + startinglane ) && i < 3; i++) {
							if ( CPUWriteableBoard[ TileToInvestigate + i ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate + i ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate + i);
								}
								i = 10;
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate + i);
							}
						}
						//Leftwards
						for (let i = 1; ( TileToInvestigate - i ) > startinglane - 1 && i < 3; i++) {
							if ( CPUWriteableBoard[ TileToInvestigate - i ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate - i ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate - i);
								}
								i = 10;
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate - i);
							}
						}
						//Upwards
						for (let i = 1; ( TileToInvestigate - 10*i ) > -1 && i < 3; i++) {
							if ( CPUWriteableBoard[ TileToInvestigate - 10*i ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate - 10*i ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 10*i);
								}
								i = 10;
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 10*i);
							}
						}
						//Downwards
						for (let i = 1; ( TileToInvestigate + 10*i ) < 80 && i < 3; i++) {
							if ( CPUWriteableBoard[ TileToInvestigate + 10*i ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate + 10*i ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 10*i);
								}
								i = 10;
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 10*i);
							}
						}
						//Rightupwards
						for (let i = 1; ( TileToInvestigate + i ) < ( startinglane + 10 ) && (TileToInvestigate - 9*i) > -1 && i < 3; i++) {
							if ( CPUWriteableBoard[ TileToInvestigate - 9*i ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate - 9*i ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 9*i);
								}
								i = 10;
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 9*i);
							}
						}
						//Leftupwards
						for (let i = 1; ( TileToInvestigate - i ) > ( startinglane - 1 ) && (TileToInvestigate - 11*i) > -1 && i < 3; i++) {
							if ( CPUWriteableBoard[ TileToInvestigate - 11*i ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate - 11*i ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 11*i);
								}
								i = 10;
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 11*i);
							}
						}
						//Rightdownwards
						for (let i = 1; ( TileToInvestigate + i ) < ( startinglane + 10 ) && (TileToInvestigate + 11*i) < 80 && i < 3; i++) {
							if ( CPUWriteableBoard[ TileToInvestigate + 11*i ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate + 11*i ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 11*i);
								}
								i = 10;
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 11*i);
							}
						}
						//Leftdownwards
						for (let i = 1; ( TileToInvestigate - i ) > ( startinglane - 1 ) && (TileToInvestigate + 9*i) < 80 && i < 3; i++) {
							if ( CPUWriteableBoard[ TileToInvestigate + 9*i ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate + 9*i ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 9*i);
								}
								i = 10;
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 9*i);
							}
						}
						break;
					case "Angel":
						//All Directions
						if ( (TileToInvestigate - 11) > -1 && TileToInvestigate > startinglane ) {
							if ( CPUWriteableBoard[ TileToInvestigate - 11 ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate - 11 ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 11);
								}
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 11);
							}
						}
						if ( (TileToInvestigate - 10) > -1 ) {
							if ( CPUWriteableBoard[ TileToInvestigate - 10 ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate - 10 ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 10);
								}
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 10);
							}
						}
						if ( (TileToInvestigate - 9) > -1 && TileToInvestigate < startinglane + 9 ) {
							if ( CPUWriteableBoard[ TileToInvestigate - 9 ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate - 9 ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 9);
								}
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 9);
							}
						}
						if ( (TileToInvestigate - 1) > -1 && TileToInvestigate > startinglane ) {
							if ( CPUWriteableBoard[ TileToInvestigate - 1 ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate - 1 ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 1);
								}
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 1);
							}
						}
						if ( (TileToInvestigate + 1) < 80 && TileToInvestigate < startinglane + 9 ) {
							if ( CPUWriteableBoard[ TileToInvestigate + 1 ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate + 1 ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 1);
								}
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 1);
							}
						}
						if ( (TileToInvestigate + 11) < 80 && TileToInvestigate < startinglane + 9 ) {
							if ( CPUWriteableBoard[ TileToInvestigate + 11 ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate + 11 ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 11);
								}
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 11);
							}
						}
						if ( (TileToInvestigate + 10) < 80 ) {
							if ( CPUWriteableBoard[ TileToInvestigate + 10 ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate + 10 ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 10);
								}
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 10);
							}
						}
						if ( (TileToInvestigate + 9) < 80 && TileToInvestigate > startinglane ) {
							if ( CPUWriteableBoard[ TileToInvestigate + 9 ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate + 9 ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 9);
								}
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 9);
							}
						}
						//Dash
						if ( (TileToInvestigate - 33) > -1 && TileToInvestigate > startinglane + 2 ) {
							if ( CPUWriteableBoard[ TileToInvestigate - 33 ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate - 33 ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 33);
								}
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 33);
							}
						}
						if ( (TileToInvestigate - 30) > -1 ) {
							if ( CPUWriteableBoard[ TileToInvestigate - 30 ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate - 30 ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 30);
								}
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 30);
							}
						}
						if ( (TileToInvestigate - 27) > -1 && TileToInvestigate < startinglane + 7 ) {
							if ( CPUWriteableBoard[ TileToInvestigate - 27 ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate - 27 ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 27);
								}
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 27);
							}
						}
						if ( (TileToInvestigate - 3) > -1 && TileToInvestigate > startinglane + 2 ) {
							if ( CPUWriteableBoard[ TileToInvestigate - 3 ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate - 3 ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 3);
								}
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 3);
							}
						}
						if ( (TileToInvestigate + 3) > -1 && TileToInvestigate < startinglane + 7 ) {
							if ( CPUWriteableBoard[ TileToInvestigate + 3 ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate + 3 ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 3);
								}
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 3);
							}
						}
						if ( (TileToInvestigate + 33) < 80 && TileToInvestigate < startinglane + 7 ) {
							if ( CPUWriteableBoard[ TileToInvestigate + 33 ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate + 33 ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 33);
								}
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 33);
							}
						}
						if ( (TileToInvestigate + 30) < 80 ) {
							if ( CPUWriteableBoard[ TileToInvestigate + 30 ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate + 30 ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 30);
								}
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 30);
							}
						}
						if ( (TileToInvestigate + 27) < 80 && TileToInvestigate > startinglane + 2 ) {
							if ( CPUWriteableBoard[ TileToInvestigate + 27 ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate + 27 ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 27);
								}
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 27);
							}
						}
						break;
						
					case "Skater":
						//Horizontal Skate Rightwards.
						for (let i = 1; ( TileToInvestigate + i ) < ( 10 + startinglane ); i++) {
							if ( CPUWriteableBoard[ TileToInvestigate + i ][0] == 0 ) {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate + i);
							} else {
								i = 10;
							}
						}
						//Horizontal Skate Leftwards.
						for (let i = 1; ( TileToInvestigate - i ) > startinglane - 1; i++) {
							if ( CPUWriteableBoard[ TileToInvestigate - i ][0] == 0 ) {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate - i);
							} else {
								i = 10;
							}
						}
						//Vertical Skate Upwards.
						for (let i = 1; ( TileToInvestigate - 10*i ) > -1 ; i++) {
							if ( CPUWriteableBoard[ TileToInvestigate - 10*i ][0] == 0 ) {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 10*i);
							} else {
								i = 10;
							}
						}
						//Vertical Skate Downwards.
						for (let i = 1; ( TileToInvestigate + 10*i ) < 80 ; i++) {
							if ( CPUWriteableBoard[ TileToInvestigate + 10*i ][0] == 0 ) {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 10*i);
							} else {
								i = 10;
							}
						}
						//Diagonal Skate Rightupwards.
						for (let i = 1; ( TileToInvestigate + i ) < ( startinglane + 10 ) && (TileToInvestigate - 9*i) > -1; i++) {
							if ( CPUWriteableBoard[ TileToInvestigate - 9*i ][0] == 0 ) {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 9*i);
							} else {
								i = 10;
							}
						}
						//Diagonal Skate Leftupwards.
						for (let i = 1; ( TileToInvestigate - i ) > ( startinglane - 1 ) && (TileToInvestigate - 11*i) > -1; i++) {
							if ( CPUWriteableBoard[ TileToInvestigate - 11*i ][0] == 0 ) {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 11*i);
							} else {
								i = 10;
							}
						}
						//Diagonal Skate Rightdownwards.
						for (let i = 1; ( TileToInvestigate + i ) < ( startinglane + 10 ) && (TileToInvestigate + 11*i) < 80; i++) {
							if ( CPUWriteableBoard[ TileToInvestigate + 11*i ][0] == 0 ) {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 11*i);
							} else {
								i = 10;
							}
						}
						//Diagonal Skate Leftdownwards.
						for (let i = 1; ( TileToInvestigate - i ) > ( startinglane - 1 ) && (TileToInvestigate + 9*i) < 80; i++) {
							if ( CPUWriteableBoard[ TileToInvestigate + 9*i ][0] == 0 ) {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 9*i);
							} else {
								i = 10;
							}
						}
						//All Directions
						if ( (TileToInvestigate - 11) > -1 && TileToInvestigate > startinglane ) {
							if ( CPUWriteableBoard[ TileToInvestigate - 11 ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate - 11 ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 11);
								}
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 11);
							}
						}
						if ( (TileToInvestigate - 10) > -1 ) {
							if ( CPUWriteableBoard[ TileToInvestigate - 10 ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate - 10 ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 10);
								}
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 10);
							}
						}
						if ( (TileToInvestigate - 9) > -1 && TileToInvestigate < startinglane + 9 ) {
							if ( CPUWriteableBoard[ TileToInvestigate - 9 ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate - 9 ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 9);
								}
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 9);
							}
						}
						if ( (TileToInvestigate - 1) > -1 && TileToInvestigate > startinglane ) {
							if ( CPUWriteableBoard[ TileToInvestigate - 1 ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate - 1 ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 1);
								}
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 1);
							}
						}
						if ( (TileToInvestigate + 1) < 80 && TileToInvestigate < startinglane + 9 ) {
							if ( CPUWriteableBoard[ TileToInvestigate + 1 ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate + 1 ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 1);
								}
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 1);
							}
						}
						if ( (TileToInvestigate + 11) < 80 && TileToInvestigate < startinglane + 9 ) {
							if ( CPUWriteableBoard[ TileToInvestigate + 11 ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate + 11 ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 11);
								}
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 11);
							}
						}
						if ( (TileToInvestigate + 10) < 80 ) {
							if ( CPUWriteableBoard[ TileToInvestigate + 10 ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate + 10 ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 10);
								}
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 10);
							}
						}
						if ( (TileToInvestigate + 9) < 80 && TileToInvestigate > startinglane ) {
							if ( CPUWriteableBoard[ TileToInvestigate + 9 ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate + 9 ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 9);
								}
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 9);
							}
						}
						break;
					
					case "Lizard":
						//Horizontal Walk Rightwards.
						for (let i = 1; ( TileToInvestigate + i ) < ( 10 + startinglane ); i++) {
							if ( CPUWriteableBoard[ TileToInvestigate + i ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate + i ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate + i);
								}
								i = 10;
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate + i);
							}
						}
						//Horizontal Walk Leftwards.
						for (let i = 1; ( TileToInvestigate - i ) > startinglane - 1; i++) {
							if ( CPUWriteableBoard[ TileToInvestigate - i ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate - i ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate - i);
								}
								i = 10;
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate - i);
							}
						}
						//Jump Two Spaces.
						if ( (TileToInvestigate - 20) > -1 ) {
							if ( CPUWriteableBoard[ TileToInvestigate - 20 ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate - 20 ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 20);
								}
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 20);
							}
						}
						if ( (TileToInvestigate + 20) < 80 ) {
							if ( CPUWriteableBoard[ TileToInvestigate + 20 ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate + 20 ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 20);
								}
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 20);
							}
						}
						//Jump Three Spaces.
						if ( (TileToInvestigate - 30) > -1 ) {
							if ( CPUWriteableBoard[ TileToInvestigate - 30 ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate - 30 ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 30);
								}
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 30);
							}
						}
						if ( (TileToInvestigate + 30) < 80 ) {
							if ( CPUWriteableBoard[ TileToInvestigate + 30 ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate + 30 ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 30);
								}
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 30);
							}
						}
						break;

					case "Bunny":
						//Vertical Bounce.
						for (let i = 0; (TileToInvestigate % 20) + i < 80; i += 20) {
							if ( CPUWriteableBoard[ (TileToInvestigate % 20) + i ][0] != 0 ) {
								if ( CPUWriteableBoard[ (TileToInvestigate % 20) + i ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, (TileToInvestigate % 20) + i);
								}
							} else {
								AI_Apply_Weight(TileToInvestigate, (TileToInvestigate % 20) + i);
							}
						}
						//Horizontal Bounce.
						for (let i = 0; ( horizontaloffset + startinglane ) + i < ( 10 + startinglane ); i += 2) {
							if ( CPUWriteableBoard[ ( horizontaloffset + startinglane ) + i ][0] != 0 ) {
								if (  CPUWriteableBoard[( horizontaloffset + startinglane ) + i ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, ( horizontaloffset + startinglane ) + i);
								}
							} else {
								AI_Apply_Weight(TileToInvestigate, ( horizontaloffset + startinglane ) + i);
							}
						}
						//Cardinals.
						if ( (TileToInvestigate - 10) > -1 ) {
							if ( CPUWriteableBoard[ TileToInvestigate - 10 ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate - 10 ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 10);
								}
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 10);
							}
						}
						if ( (TileToInvestigate + 10) < 80 ) {
							if ( CPUWriteableBoard[ TileToInvestigate + 10 ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate + 10 ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 10);
								}
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 10);
							}
						}
						if ( (TileToInvestigate - 1) > -1 && TileToInvestigate > startinglane ) {
							if ( CPUWriteableBoard[ TileToInvestigate - 1 ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate - 1 ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 1);
								}
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 1);
							}
						}
						if ( (TileToInvestigate + 1) < 80 && TileToInvestigate < startinglane + 9 ) {
							if ( CPUWriteableBoard[ TileToInvestigate + 1 ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate + 1 ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 1);
								}
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 1);
							}
						}
						break;
						
					case "Child":
						//Grid Float.
						if ( (TileToInvestigate - 22) > -1 && TileToInvestigate > startinglane + 1 ) {
							if ( CPUWriteableBoard[ TileToInvestigate - 22 ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate - 22 ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 22);
								}
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 22);
							}
						}
						if ( (TileToInvestigate - 20) > -1 ) {
							if ( CPUWriteableBoard[ TileToInvestigate - 20 ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate - 20 ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 20);
								}
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 20);
							}
						}
						if ( (TileToInvestigate - 18) > -1 && TileToInvestigate < startinglane + 8 ) {
							if ( CPUWriteableBoard[ TileToInvestigate - 18 ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate - 18 ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 18);
								}
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 18);
							}
						}
						if ( (TileToInvestigate - 2) > -1 && TileToInvestigate > startinglane + 1 ) {
							if ( CPUWriteableBoard[ TileToInvestigate - 2 ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate - 2 ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 2);
								}
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 2);
							}
						}
						if ( (TileToInvestigate + 2) > -1 && TileToInvestigate < startinglane + 8 ) {
							if ( CPUWriteableBoard[ TileToInvestigate + 2 ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate + 2 ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 2);
								}
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 2);
							}
						}
						if ( (TileToInvestigate + 18) < 80 && TileToInvestigate > startinglane + 1 ) {
							if ( CPUWriteableBoard[ TileToInvestigate + 18 ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate + 18 ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 18);
								}
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 18);
							}
						}
						if ( (TileToInvestigate + 20) < 80 ) {
							if ( CPUWriteableBoard[ TileToInvestigate + 20 ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate + 20 ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 20);
								}
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 20);
							}
						}
						if ( (TileToInvestigate + 22) < 80 && TileToInvestigate < startinglane + 8 ) {
							if ( CPUWriteableBoard[ TileToInvestigate + 22 ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate + 22 ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 22);
								}
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 22);
							}
						}
						break;
						
					case "Gentleman":
						//Cardinals.
						if ( (TileToInvestigate - 10) > -1 ) {
							if ( CPUWriteableBoard[ TileToInvestigate - 10 ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate - 10 ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 10);
								}
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 10);
							}
						}
						if ( (TileToInvestigate + 10) < 80 ) {
							if ( CPUWriteableBoard[ TileToInvestigate + 10 ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate + 10 ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 10);
								}
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 10);
							}
						}
						if ( (TileToInvestigate - 1) > -1 && TileToInvestigate > startinglane ) {
							if ( CPUWriteableBoard[ TileToInvestigate - 1 ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate - 1 ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 1);
								}
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 1);
							}
						}
						if ( (TileToInvestigate + 1) < 80 && TileToInvestigate < startinglane + 9 ) {
							if ( CPUWriteableBoard[ TileToInvestigate + 1 ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate + 1 ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 1);
								}
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 1);
							}
						}
						//Horizontal Magnet Rightwards.
						for (let i = 1; ( TileToInvestigate + i ) < ( 10 + startinglane ); i++) {
							if ( CPUWriteableBoard[ TileToInvestigate + i ][1] == notcurrentClass ) {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate + i);
								i = 10;
							}
						}
						//Horizontal Magnet Leftwards.
						for (let i = 1; ( TileToInvestigate - i ) > startinglane - 1; i++) {
							if ( CPUWriteableBoard[ TileToInvestigate - i ][1] == (  notcurrentClass  ) ) {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate - i);
								i = 10;
							}
						}
						//Vertical Magnet PL_Upwards.
						for (let i = 1; ( TileToInvestigate - 10*i ) > -1 ; i++) {
							if ( CPUWriteableBoard[ TileToInvestigate - 10*i ][1] == notcurrentClass ) {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 10*i);
								i = 10;
							}
						}
						//Vertical Magnet Downwards.
						for (let i = 1; ( TileToInvestigate + 10*i ) < 80 ; i++) {
							if ( CPUWriteableBoard[ TileToInvestigate + 10*i ][1] == notcurrentClass ) {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 10*i);
								i = 10;
							}
						}
						//Diagonal Magnet Rightupwards.
						for (let i = 1; ( TileToInvestigate + i ) < ( startinglane + 10 ) && (TileToInvestigate - 9*i) > -1; i++) {
							if ( CPUWriteableBoard[ TileToInvestigate - 9*i ][1] == notcurrentClass ) {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 9*i);
								i = 10;
							}
						}
						//Diagonal Magnet Leftupwards.
						for (let i = 1; ( TileToInvestigate - i ) > ( startinglane - 1 ) && (TileToInvestigate - 11*i) > -1; i++) {
							if ( CPUWriteableBoard[ TileToInvestigate - 11*i ][1] == notcurrentClass ) {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 11*i);
								i = 10;
							}
						}
						//Diagonal Magnet Rightdownwards.
						for (let i = 1; ( TileToInvestigate + i ) < ( startinglane + 10 ) && (TileToInvestigate + 11*i) < 80; i++) {
							if ( CPUWriteableBoard[ TileToInvestigate + 11*i ][1] == notcurrentClass ) {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 11*i);
								i = 10;
							}
						}
						//Diagonal Magnet Leftdownwards.
						for (let i = 1; ( TileToInvestigate - i ) > ( startinglane - 1 ) && (TileToInvestigate + 9*i) < 80; i++) {
							if ( CPUWriteableBoard[ TileToInvestigate + 9*i ][1] == notcurrentClass ) {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 9*i);
								i = 10;
							}
						}
						break;
						
					case "Duplicator":
						//Cardinals.
						if ( (TileToInvestigate - 10) > -1 ) {
							if ( CPUWriteableBoard[ TileToInvestigate - 10 ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate - 10 ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 10);
								}
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 10);
							}
						}
						if ( (TileToInvestigate + 10) < 80 ) {
							if ( CPUWriteableBoard[ TileToInvestigate + 10 ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate + 10 ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 10);
								}
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 10);
							}
						}
						if ( (TileToInvestigate - 1) > -1 && TileToInvestigate > startinglane ) {
							if ( CPUWriteableBoard[ TileToInvestigate - 1 ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate - 1 ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 1);
								}
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 1);
							}
						}
						if ( (TileToInvestigate + 1) < 80 && TileToInvestigate < startinglane + 9 ) {
							if ( CPUWriteableBoard[ TileToInvestigate + 1 ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate + 1 ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 1);
								}
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 1);
							}
						}
						//Summon Duplicates.
						if (current == 1 && duplicates[0] < 5 || current == -1 && duplicates[1] < 5) {
							if ( (TileToInvestigate - 11) > -1 && TileToInvestigate > startinglane && CPUWriteableBoard[ TileToInvestigate - 11 ][0] == 0 ) {
								CPUIsSpecialMove = 1;
								AI_Apply_Weight(88, TileToInvestigate - 11);
							}
							if ( (TileToInvestigate - 9) > -1 && TileToInvestigate < (startinglane + 9) && CPUWriteableBoard[ TileToInvestigate - 9 ][0] == 0) {
								CPUIsSpecialMove = 1;
								AI_Apply_Weight(88, TileToInvestigate - 9);
							}
							if ( (TileToInvestigate + 11) < 80 && TileToInvestigate < (startinglane + 9) && CPUWriteableBoard[ TileToInvestigate + 11 ][0] == 0 ) {
								CPUIsSpecialMove = 1;
								AI_Apply_Weight(88, TileToInvestigate + 11);
							}
							if ( (TileToInvestigate + 9) < 80 && TileToInvestigate > startinglane && CPUWriteableBoard[ TileToInvestigate + 9 ][0] == 0) {
								CPUIsSpecialMove = 1;
								AI_Apply_Weight(88, TileToInvestigate + 9);
							}
						}
						break;
					
					case "Duplicate":
						//Conditional Cardinals + Diagonals. (Only forwards and sideways movement).
						if ( current == 1 ) {
							if ( (TileToInvestigate - 11) > -1 && TileToInvestigate > startinglane ) {
								if ( CPUWriteableBoard[ TileToInvestigate - 11 ][0] != 0 ) {
									if ( CPUWriteableBoard[ TileToInvestigate - 11 ][1] == notcurrentClass ) {
										AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 11);
									}
								} else {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 11);
								}
							}
							if ( (TileToInvestigate - 10) > -1 ) {
								if ( CPUWriteableBoard[ TileToInvestigate - 10 ][0] != 0 ) {
									if ( CPUWriteableBoard[ TileToInvestigate - 10 ][1] == notcurrentClass ) {
										AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 10);
									}
								} else {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 10);
								}
							}
							if ( (TileToInvestigate - 9) > -1 && TileToInvestigate < startinglane + 9 ) {
								if ( CPUWriteableBoard[ TileToInvestigate - 9 ][0] != 0 ) {
									if ( CPUWriteableBoard[ TileToInvestigate - 9 ][1] == notcurrentClass ) {
										AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 9);
									}
								} else {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 9);
								}
							}
						} else {
							if ( (TileToInvestigate + 11) < 80 && TileToInvestigate < startinglane + 9 ) {
								if ( CPUWriteableBoard[ TileToInvestigate + 11 ][0] != 0 ) {
									if ( CPUWriteableBoard[ TileToInvestigate + 11 ][1] == notcurrentClass ) {
										AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 11);
									}
								} else {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 11);
								}
							}
							if ( (TileToInvestigate + 10) < 80 ) {
								if ( CPUWriteableBoard[ TileToInvestigate + 10 ][0] != 0 ) {
									if ( CPUWriteableBoard[ TileToInvestigate + 10 ][1] == notcurrentClass ) {
										AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 10);
									}
								} else {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 10);
								}
							}
							if ( (TileToInvestigate + 9) < 80 && TileToInvestigate > startinglane ) {
								if ( CPUWriteableBoard[ TileToInvestigate + 9 ][0] != 0 ) {
									if ( CPUWriteableBoard[ TileToInvestigate + 9 ][1] == notcurrentClass ) {
										AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 9);
									}
								} else {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 9);
								}
							}
						}
						if ( (TileToInvestigate - 1) > -1 && TileToInvestigate > startinglane ) {
							if ( CPUWriteableBoard[ TileToInvestigate - 1 ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate - 1 ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 1);
								}
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 1);
							}
						}
						if ( (TileToInvestigate + 1) < 80 && TileToInvestigate < startinglane + 9 ) {
							if ( CPUWriteableBoard[ TileToInvestigate + 1 ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate + 1 ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 1);
								}
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 1);
							}
						}
						break;
						
					case "Pastafarian":
						//Light-Bridge (only usable when not broken):
						//Horizontal Rightwards.
						if ( ( TileToInvestigate + 1 ) < ( 10 + startinglane ) && CPUWriteableBoard[ TileToInvestigate + 1 ].length < 2 ) {
							for (let i = 2; ( TileToInvestigate + i ) < ( 10 + startinglane ) && ( i < 5 ); i++) {
								if ( CPUWriteableBoard[ TileToInvestigate + i ][0] != 0 ) {
									if ( CPUWriteableBoard[ TileToInvestigate + i ][0] == "Pit" ) {
									//Do nothing.
									} else {
										if ( CPUWriteableBoard[ TileToInvestigate + i ][1] == notcurrentClass ) {
											CPUIsSpecialMove = 2;
											AI_Apply_Weight(TileToInvestigate, TileToInvestigate + i);
										}
										i = 6;
									}
								} else {
									CPUIsSpecialMove = 2;
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate + i);
								}
							}
						}
						//Horizontal Leftwards.
						if ( ( TileToInvestigate - 1 ) > ( startinglane - 1 ) && CPUWriteableBoard[ TileToInvestigate - 1 ].length < 2 ) {
							for (let i = 2; ( TileToInvestigate - i ) > ( startinglane - 1 ) && ( i < 5 ); i++) {
								if ( CPUWriteableBoard[ TileToInvestigate - i ][0] != 0 ) {
									if ( CPUWriteableBoard[ TileToInvestigate - i ][0] == "Pit" ) {
									//Do nothing.
									} else {
										if ( CPUWriteableBoard[ TileToInvestigate - i ][1] == notcurrentClass ) {
											CPUIsSpecialMove = 2;
											AI_Apply_Weight(TileToInvestigate, TileToInvestigate - i);
										}

										i = 6;
									}
								} else {
									CPUIsSpecialMove = 2;
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate - i);
								}
							}
						}
						//Vertical Upwards.
						if ( ( TileToInvestigate - 10 ) > -1 && CPUWriteableBoard[ TileToInvestigate - 10 ].length < 2 ) {
							for (let i = 2; ( TileToInvestigate - 10*i ) > -1 && ( i < 5 ); i++) {
								if ( CPUWriteableBoard[ TileToInvestigate - 10*i ][0] != 0 ) {
									if ( CPUWriteableBoard[ TileToInvestigate - 10*i ][0] == "Pit" ) {
									//Do nothing.
									} else {
										if ( CPUWriteableBoard[ TileToInvestigate - 10*i ][1] == notcurrentClass ) {
											CPUIsSpecialMove = 2;
											AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 10*i);
										}
										i = 6;
									}
								} else {
									CPUIsSpecialMove = 2;
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 10*i);
								}
							}
						}
						//Vertical Downwards.
						if ( ( TileToInvestigate + 10 ) < 80 && CPUWriteableBoard[ TileToInvestigate + 10 ].length < 2 ) {
							for (let i = 2; ( TileToInvestigate + 10*i ) < 80 && ( i < 5 ); i++) {
								if ( CPUWriteableBoard[ TileToInvestigate + 10*i ][0] != 0 ) {
									if ( CPUWriteableBoard[ TileToInvestigate + 10*i ][0] == "Pit" ) {
									//Do nothing.
									} else {
										if ( CPUWriteableBoard[ TileToInvestigate + 10*i ][1] == notcurrentClass ) {
											CPUIsSpecialMove = 2;
											AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 10*i);
										}

										i = 6;
									}
								} else {
									CPUIsSpecialMove = 2;
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 10*i);
								}
							}
						}
						//Diagonal Rightupwards.
						if ( ( TileToInvestigate + 1 ) < ( startinglane + 10 ) && ( TileToInvestigate - 9 ) > -1 && CPUWriteableBoard[ TileToInvestigate - 9 ].length < 2 ) {
							for (let i = 2; ( TileToInvestigate + i ) < ( startinglane + 10 ) && ( TileToInvestigate - 9*i ) > -1 && ( i < 5 ); i++) {
								if ( CPUWriteableBoard[ TileToInvestigate - 9*i ][0] != 0 ) {
									if ( CPUWriteableBoard[ TileToInvestigate - 9*i ][0] == "Pit" ) {
									//Do nothing.
									} else {
										if ( CPUWriteableBoard[ TileToInvestigate - 9*i ][1] == notcurrentClass ) {
											CPUIsSpecialMove = 2;
											AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 9*i);
										}
										i = 6;
									}
								} else {
									CPUIsSpecialMove = 2;
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 9*i);
								}
							}
						}
						//Diagonal Leftupwards.
						if ((TileToInvestigate - 1) > (startinglane - 1) && (TileToInvestigate - 11) > -1 && CPUWriteableBoard[TileToInvestigate - 11].length < 2) {
							for (let i = 2; (TileToInvestigate - i) > (startinglane - 1) && (TileToInvestigate - 11*i) > -1 && (i < 5); i++) {
								if (CPUWriteableBoard[TileToInvestigate - 11*i][0] != 0) {
									if (CPUWriteableBoard[TileToInvestigate - 11*i][0] == "Pit") {
									// Do nothing.
									} else {
										if (CPUWriteableBoard[TileToInvestigate - 11*i][1] == notcurrentClass) {
											CPUIsSpecialMove = 2;
											AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 11*i);
										}
										i = 6;
									}
								} else {
									CPUIsSpecialMove = 2;
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 11*i);
								}
							}
						}
						//Diagonal Rightdownwards.
						if ((TileToInvestigate + 1) < (startinglane + 10) && (TileToInvestigate + 11) < 80 && CPUWriteableBoard[TileToInvestigate + 11].length < 2) {
							for (let i = 2; (TileToInvestigate + i) < (startinglane + 10) && (TileToInvestigate + 11 * i) < 80 && (i < 5); i++) {
								if (CPUWriteableBoard[TileToInvestigate + 11*i][0] != 0) {
									if (CPUWriteableBoard[TileToInvestigate + 11*i][0] == "Pit") {
									// Do nothing.
									} else {
										if (CPUWriteableBoard[TileToInvestigate + 11*i][1] == notcurrentClass) {
											CPUIsSpecialMove = 2;
											AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 11*i);
										}
										i = 6;
									}
								} else {
									CPUIsSpecialMove = 2;
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 11*i);
								}
							}
						}
						//Diagonal Leftdownwards.
						if ((TileToInvestigate - 1) > (startinglane - 1) && (TileToInvestigate + 9) < 80 && CPUWriteableBoard[TileToInvestigate + 9].length < 2) {
							for (let i = 2; (TileToInvestigate - i) > (startinglane - 1) && (TileToInvestigate + 9*i) < 80 && (i < 5); i++) {
								if (CPUWriteableBoard[TileToInvestigate + 9*i][0] != 0) {
									if (CPUWriteableBoard[TileToInvestigate + 9*i][0] == "Pit") {
									// Do nothing.
									} else {
										if (CPUWriteableBoard[TileToInvestigate + 9*i][1] == notcurrentClass) {
											CPUIsSpecialMove = 2;
											AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 9*i);
										}
										i = 6;
									}
								} else {
									CPUIsSpecialMove = 2;
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 9*i);
								}
							}
						}
					case "broken2":
						//All Directions
						if ( (TileToInvestigate - 11) > -1 && TileToInvestigate > startinglane ) {
							if ( CPUWriteableBoard[ TileToInvestigate - 11 ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate - 11 ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 11);
								}
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 11);
							}
						}
						if ( (TileToInvestigate - 10) > -1 ) {
							if ( CPUWriteableBoard[ TileToInvestigate - 10 ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate - 10 ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 10);
								}
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 10);
							}
						}
						if ( (TileToInvestigate - 9) > -1 && TileToInvestigate < startinglane + 9 ) {
							if ( CPUWriteableBoard[ TileToInvestigate - 9 ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate - 9 ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 9);
								}
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 9);
							}
						}
						if ( (TileToInvestigate - 1) > -1 && TileToInvestigate > startinglane ) {
							if ( CPUWriteableBoard[ TileToInvestigate - 1 ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate - 1 ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 1);
								}
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 1);
							}
						}
						if ( (TileToInvestigate + 1) < 80 && TileToInvestigate < startinglane + 9 ) {
							if ( CPUWriteableBoard[ TileToInvestigate + 1 ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate + 1 ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 1);
								}
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 1);
							}
						}
						if ( (TileToInvestigate + 11) < 80 && TileToInvestigate < startinglane + 9 ) {
							if ( CPUWriteableBoard[ TileToInvestigate + 11 ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate + 11 ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 11);
								}
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 11);
							}
						}
						if ( (TileToInvestigate + 10) < 80 ) {
							if ( CPUWriteableBoard[ TileToInvestigate + 10 ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate + 10 ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 10);
								}
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 10);
							}
						}
						if ( (TileToInvestigate + 9) < 80 && TileToInvestigate > startinglane ) {
							if ( CPUWriteableBoard[ TileToInvestigate + 9 ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate + 9 ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 9);
								}
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 9);
							}
						}
						break;
						
					case "Student":
						//Strafe.
						if ( (TileToInvestigate - 1) > -1 && TileToInvestigate > startinglane ) {
							if ( CPUWriteableBoard[ TileToInvestigate - 1 ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate - 1 ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 1);
								}
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 1);
							}
						}
						if ( (TileToInvestigate + 1) < 80 && TileToInvestigate < startinglane + 9 ) {
							if ( CPUWriteableBoard[ TileToInvestigate + 1 ][0] != 0 ) {
								if ( CPUWriteableBoard[ TileToInvestigate + 1 ][1] == notcurrentClass ) {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 1);
								}
							} else {
								AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 1);
							}
						}
						//Jump.
						for (let i = 1; i < 5; i++) {
							if ( (TileToInvestigate + 10*i) < 80 ) {
								if ( CPUWriteableBoard[ TileToInvestigate + 10*i ][0] != 0 ) {
									if ( CPUWriteableBoard[ TileToInvestigate + 10*i ][1] == notcurrentClass ) {
										AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 10*i);
									}
								} else {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate + 10*i);
								}
							} else {
								i = 5;
							}
						}
						for (let i = 1; i < 5; i++) {
							if ( (TileToInvestigate - 10*i) > -1 ) {
								if ( CPUWriteableBoard[ TileToInvestigate - 10*i ][0] != 0 ) {
									if ( CPUWriteableBoard[ TileToInvestigate - 10*i ][1] == notcurrentClass ) {
										AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 10*i);
									}
								} else {
									AI_Apply_Weight(TileToInvestigate, TileToInvestigate - 10*i);
								}
							} else {
								i = 5;
							}
						}
						break;
						
				}
			
			}
		
		}
		
		//End weight summation.
		//The one thing this script has in common with The Biggest Loser.

		if (current == CPUOriginalTeam) {

			return Math.floor( Math.random() * CPUpossibleMoves.length );

		} else {

			if (CPUBestSummed < CPUBestMoveWeight[1] - CPUBestMoveWeight[0]) {
				console.log("Previous best weight:");
				console.log(CPUBestSummed);
				console.log("Move and weight of [1]:");
				console.log(CPUMoveHistory[1]);
				console.log(CPUBestMoveWeight[1]);
				console.log("Move and weight of [0]:");
				console.log(CPUBestMoveWeight[0]);
				console.log(CPUMoveHistory[0]);
				console.log("The whole damn board:");
				console.log(CPUWriteableBoard);
				console.log("-");

				CPUBestSummed = CPUBestMoveWeight[1] - CPUBestMoveWeight[0];
				
				CPUpossibleMoves = [];
				CPUpossibleMoves.push( CPUMoveHistory[1] );

			} else {

				if (CPUBestSummed == CPUBestMoveWeight[1] - CPUBestMoveWeight[0]) {

					CPUpossibleMoves.push( CPUMoveHistory[1] );

				}

			}

			CPUBestMoveWeight.shift();
			CPUMoveHistory.shift();
			
			CPUBestMoveWeight[0] = 0;

			//Copies the array by iterating through each element, since otherwise it only copies the reference to the element.
			CPUWriteableBoard = [];
			for (let i = 0; i < 80; i++) {
				CPUWriteableBoard.push(CPUCurrentBoard[i]);
			}
			
			current = -1 * current;
			currentClass = "_" + current;
			notcurrentClass = "_" + current * -1;

			return;

		}

	}
