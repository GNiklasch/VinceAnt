/*
 * GNi 2018-04-17

For background and context, see:
https://codegolf.stackexchange.com/questions/135102/formic-functions-ant-queen-of-the-hill-contest
https://trichoplax.github.io/formic-functions/

*/

// ---- Constants aren't ... ----

// -- Ant types: --
var ANT_NAVIGATOR = 1;
var ANT_MARK = 2;
var ANT_GEORGES = 3;
var ANT_WILLIAM = 4;
var ANT_QUEEN = 5;

// Console logging guards:  Don't enable any in live competition.
var DEBUGME = [false, false, false, false, false, false];
// DEBUGME[ANT_NAVIGATOR] = true // ###
// DEBUGME[ANT_MARK] = true // ###
// DEBUGME[ANT_GEORGES] = true // ###
// DEBUGME[ANT_WILLIAM] = true // ###
// DEBUGME[ANT_QUEEN] = true // ###

// -- Food hoarding thresholds (tunables): --
var THRESHOLDC = 1; // transition from trail-guided to lightspeed scrambling
var THRESHOLD1 = 15; // ### tbd

// We lock in queen's hoarded food  (don't expend it on new workers,
// except in dire emergencies)  when the current amount modulo
// RATCHET_MODULUS equals RATCHET_RESIDUE:
var RATCHET_MODULUS = 7;
var RATCHET_RESIDUE = 4;

// -- Physical colors: --
// These could be permuted without breaking anything else below
// (except for a number of mnemonic comments).
var COL_WHITE = 1;
var COL_YELLOW = 2;
var COL_PURPLE = 3;
var COL_CYAN = 4;
var COL_RED = 5;
var COL_GREEN = 6;
var COL_BLUE = 7;
var COL_BLACK = 8;

// -- Logical colors: --
var LCL_CLEAR = COL_WHITE;

// Trail during initial scrambles:
var LCL_TRAIL = COL_YELLOW;

// Lightspeed communications when the navigator sees something the queen
// cannot see:
var LCL_LS_FOOD = COL_PURPLE;

// #### tbd

// -- Addressing cells in the neighborhood: --

var TOTAL_NBRS = 8;

// Expressed in controller's coordinates:
var POS_CENTER = 4;
var CELL_NOP = {cell:POS_CENTER};

/*
 * Mapping our logical to the controller's physical notion of cell coordinates:
 *
 * We think of what we want to be the "bottom left" (or southwest) neighbor
 * cell as neighbor 0, and proceed counterclockwise, ending with number 7
 * on the left (west).
 * The CCW array maps these ordinals to subscripts into the controller's
 * view[] array.  It is long enough to compute subscripts e.g. of
 * opposite or adjacent neighbor cells without reducing mod 8.  E.g.,
 * the sum of 6 for the compass setting, 7 for a neighbor cell of current
 * interest, plus another 7 meaning "-1 mod 8", i.e. the next neighbor cell
 * in clockwise order, can safely be fed into CCW without falling off the end.
 */
var CCW = [6, 7, 8, 5, 2, 1, 0, 3, 6, 7, 8, 5, 2, 1, 0, 3, 6, 7, 8, 5, 2, 1];

// ---- ... variables won't.  (Well, some will.) ----

/*
 * The compass  (base offset into CCW, taking values from {0, 2, 4, 6})
 * will be set once we determine which way we're facing, based on either
 * seeing our own queen, or a pal of a particular kind or two, or the
 * color pattern under our feet.
 */
var compass = -1;

// ---- Who am I? ----
var here = view[POS_CENTER];
var myColor = here.color;
var myself = here.ant;
var myType = myself.type;
var myFood = myself.food;
var amNotHungry = (myType != ANT_QUEEN && myFood > 0);


// ---- Where am I?  Take stock of our surroundings ----

/*
 * Guards for cells we may have a need to step onto:
 *
 * The destOK array is indexed by controller coordinates.
 * The queen and unladen workers can step onto cells containing food
 * but no other ant, except the Engineer shouldn't  (she might inadvertently
 * steal food but would never bring it home).  Laden workers can't step
 * onto ants or food.  The destOK array and unobstructed variable are
 * initialized to all true and then set to match reality a moment later.
 */
var destOK = [true, true, true, true, true, true, true, true, true];
var unobstructed = true; // summary thereof

/*
 * For a quick first look at our surroundings, we always collect:
 *
 * + a spectrum of the cells in view  (how often each color occurs),
 * + same but broken down by edge vs corner neighbor cells,
 * + how much food there is around us,
 * + same but broken down by edge vs corner neighbor cells,
 * --- loop separately over both kinds, accumulating totals as we go
 * + how many friendly ants of each type there are around us
 *   (where relevant, we'll pinpoint their locations later)
 *   and how many of them are laden,
 * --- except if our queen is in view, note the orientation straight away,
 * + how many enemy queens and how many enemy workers there are around us
 *   (the worker types are meaningless to us and food transfers would
 *   happen automatically if they haven't already happened),
 * + whether or not we're obstructed in any way
 *   (as a queen or unladen worker, by any other ants;  as a laden worker,
 *   by any other ants or food).
 */

// Per color:
// Colors are numbered from 1 to 8;  in the arrays indexed by a color
// we therefore waste slot 0.
var specLateral = [0, 0, 0, 0, 0, 0, 0, 0, 0];
var specDiagonal = [0, 0, 0, 0, 0, 0, 0, 0, 0];
var specNbrs = [0, 0, 0, 0, 0, 0, 0, 0, 0];
var specTotal = [0, 0, 0, 0, 0, 0, 0, 0, 0];
var foodLateral = 0;
var foodDiagonal = 0;
var foodTotal = 0;

specTotal[myColor]++;

// Inspect corner cells:
for (i = 0; i < TOTAL_NBRS; i += 2) {
    var cell = view[CCW[i]];
    specDiagonal[cell.color]++;
    specNbrs[cell.color]++;
    specTotal[cell.color]++;
    if (cell.food > 0) {
	foodDiagonal++;
	foodTotal++;
	if (amNotHungry) {
	    destOK[CCW[i]] = false;
	    unobstructed = false;
	}
    }
}

// Inspect edge cells:
for (i = 1; i < TOTAL_NBRS; i += 2) {
    var cell = view[CCW[i]];
    specLateral[cell.color]++;
    specNbrs[cell.color]++;
    specTotal[cell.color]++;
    if (cell.food > 0) {
	foodLateral++;
	foodTotal++;
	if (amNotHungry) {
	    destOK[CCW[i]] = false;
	    unobstructed = false;
	}
    }
}

// Any other ants nearby?  Per ant type:
// Ant types are numbered from 1 to 5;  in the arrays indexed by an ant type
// we therefore waste slot 0.
var adjFriends = [0, 0, 0, 0, 0, 0];
var adjLadenFriends = [0, 0, 0, 0, 0, 0];
var adjUnladenFriends = [0, 0, 0, 0, 0, 0];
var friendsTotal = 0;
var myQueenPos = 0;
var adjFoes = [0, 0, 0, 0, 0, 0];
var adjLadenFoes = [0, 0, 0, 0, 0, 0];
var adjUnladenFoes = [0, 0, 0, 0, 0, 0];
var foesTotal = 0;
// We don't care much about enemy worker's types except as a source of entropy,
// but we do occasionally care about enemy queens...

for (i = 0; i < TOTAL_NBRS; i++) {
    var cell = view[CCW[i]];
    if (cell.ant) {
	if (cell.ant.friend) {
	    adjFriends[cell.ant.type]++;
	    friendsTotal++;
	    if (cell.ant.type == ANT_QUEEN) {
		compass = i & 6;
		myQueenPos = i & 1;
	    }
	    if (cell.ant.food > 0) {
		adjLadenFriends[cell.ant.type]++;
	    } else {
		adjUnladenFriends[cell.ant.type]++;
	    }
	} else {
	    adjFoes[cell.ant.type]++;
	    foesTotal++;
	    if (cell.ant.food > 0) {
		adjLadenFoes[cell.ant.type]++;
	    } else {
		adjUnladenFoes[cell.ant.type]++;
	    }
	}
	destOK[CCW[i]] = false;
	unobstructed = false;
    }
}

// Now my own queen is in view iff adjFriends[ANT_QUEEN] > 0;
// in this case we'll already have set our compass and noted whether she
// is straight behind us (myQueenPos = 1) or rear left (0).

// ---- What am I doing here? ----

// ---- Decision Tree: top level ----

switch (myType) {
case ANT_QUEEN:
    return (runQueenStrategies());
case ANT_NAVIGATOR:
    return (runNavStrategies());
case ANT_MARK:
    return (runMarkStrategies());
case ANT_GEORGES:
    return (runGeorgesStrategies());
case ANT_WILLIAM:
    return (runWilliamStrategies());
default:
    return CELL_NOP; // notreached
}

// ---- (Ant function body ends here;  remainder is function definitions) ----

// ---- Decision Tree: Second level ----

function runQueenStrategies() {
    debugme("runQueenStrategies: adjFriends: " + adjFriends);
    switch (adjFriends[ANT_NAVIGATOR]) {
    case 0:
	return (runQueenScramblingStrategy());
    case 1:
	for (var i = 0; i < TOTAL_NBRS; i++) {
	    var cell = view[CCW[i]];
	    if (cell.ant && cell.ant.friend &&
		cell.ant.type == ANT_NAVIGATOR) {
		compass = i & 6;
		debugme("Queen: compass is set at " + compass);
		if (i & 1) {
		    return (runQueenLightspeedStrategy());
		} else {
		    return (runQueenConfusedStrategy());
		}
	    }
	}
	break; // notreached
    default:
	// this should be a Strategy...
	for (var i = 0; i < TOTAL_NBRS; i++) {
	    var cell = view[CCW[i]];
	    if (cell.ant && cell.ant.friend &&
		cell.ant.type == ANT_NAVIGATOR) {
		// found one, where are the others...?
		if (i & 1) {
		    // in the correct place, too
		    if (destOK[CCW[i-1]]) {
			return {cell:CCW[i-1]};
		    } else if (destOK[CCW[i+1]]) {
			return {cell:CCW[i+1]};
		    } else if (destOK[CCW[i+4]]) {
			return {cell:CCW[i+4]};
		    } else {
			return CELL_NOP;
		    }
		} else {
		    if (destOK[CCW[i+7]]) {
			return {cell:CCW[i+7]};
		    } else if (destOK[CCW[i+1]]) {
			return {cell:CCW[i+1]};
		    } else if (destOK[CCW[i+4]]) {
			return {cell:CCW[i+4]};
		    } else {
			return CELL_NOP;
		    }
		}
	    }
	}
	return (runQueenConfusedStrategy());
    }
    return CELL_NOP; // notreached
}

function runNavStrategies() {
    if (adjFriends[ANT_QUEEN] > 0) {
	// Assert:  compass is set, queen and myself mutually at CCW[compass+1]
	// (facing in opposite directions).
	return (runNavLightspeedStrategy());
    } else if ((myFood == 0) && (foodTotal > 0)) {
	return (runPainterEatingStrategy());
    } else {
	// #### future cooperative cases...
	return (runPaulPaintingStrategy());
    }
}

function runMarkStrategies() {
    if ((adjFriends[ANT_QUEEN] > 0) && (myFood == 0)) {
	// Assert:  compass is set, queen at CCW[myQueenPos].
	// Step out of the way.
	if (destOK[CCW[compass+4]]) {
	    return {cell:CCW[compass+4]};
	} else if (destOK[CCW[compass+3]]) {
	    return {cell:CCW[compass+3]};
	} else if (destOK[CCW[compass+5]]) {
	    return {cell:CCW[compass+5]};
	} else if (destOK[CCW[compass+2]]) {
	    return {cell:CCW[compass+2]};
	} else {
	    return CELL_NOP;
	}
    } else if ((myFood == 0) && (foodTotal > 0)) {
	return (runPainterEatingStrategy());
    } else if ((adjFriends[ANT_GEORGES] == 1) &&
	       (adjFriends[ANT_WILLIAM] == 0)) {
	return (runClaudePaintingStrategy());
    } else {
	return (runMarkPaintingStrategy());
    }
}

function runGeorgesStrategies() {
    if ((adjFriends[ANT_QUEEN] > 0) && (myFood == 0)) {
	// Assert:  compass is set, queen at CCW[myQueenPos].
	// Step out of the way.
	if (destOK[CCW[compass+4]]) {
	    return {cell:CCW[compass+4]};
	} else if (destOK[CCW[compass+3]]) {
	    return {cell:CCW[compass+3]};
	} else if (destOK[CCW[compass+5]]) {
	    return {cell:CCW[compass+5]};
	} else if (destOK[CCW[compass+2]]) {
	    return {cell:CCW[compass+2]};
	} else {
	    return CELL_NOP;
	}
    } else if ((myFood == 0) && (foodTotal > 0)) {
	return (runPainterEatingStrategy());
    } else if ((adjFriends[ANT_MARK] == 1) &&
	       (adjFriends[ANT_WILLIAM] == 0)) {
	return (runJeanPaintingStrategy());
    } else {
	return (runGeorgesPaintingStrategy());
    }
}

function runWilliamStrategies() {
    if ((adjFriends[ANT_QUEEN] > 0) && (myFood == 0)) {
	// Assert:  compass is set, queen at CCW[myQueenPos].
	// Step out of the way.
	if (destOK[CCW[compass+4]]) {
	    return {cell:CCW[compass+4]};
	} else if (destOK[CCW[compass+3]]) {
	    return {cell:CCW[compass+3]};
	} else if (destOK[CCW[compass+5]]) {
	    return {cell:CCW[compass+5]};
	} else if (destOK[CCW[compass+2]]) {
	    return {cell:CCW[compass+2]};
	} else {
	    return CELL_NOP;
	}
    } else if ((myFood == 0) && (foodTotal > 0)) {
	return (runPainterEatingStrategy());
    } else {
	// #### future cooperative cases...
	return (runWilliamPaintingStrategy());
    }
}

// ---- Decision Tree: Third level ----

// Queen's strategies

function runQueenScramblingStrategy() {
    // Still need to orient ourselves.
    if (unobstructed) {
	if (foodTotal > 0) {
	    return (runQueenScramblingEatingTactic()); // fast path
	} else if (myFood >= THRESHOLDC) {
	    // Create the navigator on a laterally adjacent cell,
	    // initiating the lightspeed phase whilst trying not to run
	    // back along the trail that got us here.
	    for (var i = 0; i < TOTAL_NBRS; i+=2) {
		if ((view[CCW[i]].color == LCL_TRAIL) ||
		    (view[CCW[i+1]].color == LCL_TRAIL)) {
		    return {cell:CCW[i+1], type:ANT_NAVIGATOR};
		}
	    }
	    // choose a random one if someone else has obliterated the trail
	    return {cell:1, type:ANT_NAVIGATOR};
	} else if (myColor != LCL_TRAIL) {
	    if ((myColor == LCL_CLEAR) ||
		(specNbrs[LCL_CLEAR] >= TOTAL_NBRS - 1)) {
		// extend trail by the cell we're standing on, fast
		return {cell:POS_CENTER, color:LCL_TRAIL};
	    } else {
		// check our surroundings more carefully
		return (runQueenScramblingTrailCheckTactic());
	    }
	    
	} else if ((specNbrs[LCL_CLEAR] >= 4) &&
		   (specNbrs[LCL_TRAIL] == 1)) {
	    // Continue trail, fast.  Still need to orient ourselves.
	    // There's one trail cell in view;  aim diagonally away from it.
	    for (var i = 0; i < TOTAL_NBRS; i+=2) {
		if ((view[CCW[i]].color == LCL_TRAIL) ||
		    (view[CCW[i+1]].color == LCL_TRAIL)) {
		    return {cell:CCW[i+4]};
		}
	    }
	} else if (specNbrs[LCL_CLEAR] == TOTAL_NBRS) {
	    // Everything's white  (trail start, or lost it).
	    // Any diagonal direction is as good as any other.
	    return {cell:0};
	} else { // slow path: no food, confusing colors
	    return (runQueenScramblingAroundTactic());
	}
    } else {
	// Obstructed.  There should not exist any friends (yet).
	if ((foodTotal > 0) && (foesTotal > 0) &&
	    (foesTotal == adjFoes[ANT_QUEEN])) {
	    // No unfriendly workers in view and there's food we can
	    // snatch before the other queen gets it.  Have at it.
	    return (runQueenScramblingSnatchingTactic());
	} else {
	    return (runQueenScramblingEvasionTactic());
	}
    }
    return CELL_NOP; // notreached
}

function runQueenLightspeedStrategy() {
    // Assert:  compass is set, navigator at CCW[compass+1].
    debugme("Lightspeed queen...");
    if ((specTotal[LCL_CLEAR] <= 2) &&
	(myFood >= THRESHOLD1) && (foesTotal == 0)) {
	// #### randomize this further when we have lots of food
	debugme("Time for some repainting...");
	switch (myFood % RATCHET_MODULUS) {
	case ANT_MARK:
	    if ((adjFriends[ANT_MARK] == 0) &&
		destOK[CCW[compass+6]] &&
		(view[CCW[compass+6]].food == 0)) {
		return {cell:CCW[compass+6], type:ANT_MARK};
	    }
	    break;
	case ANT_GEORGES:
	    if ((adjFriends[ANT_GEORGES] == 0) &&
		destOK[CCW[compass+5]] &&
		(view[CCW[compass+5]].food == 0)) {
		return {cell:CCW[compass+5], type:ANT_GEORGES};
	    }
	    break;
	case ANT_WILLIAM:
	    if ((adjFriends[ANT_WILLIAM] == 0) &&
		destOK[CCW[compass+6]] &&
		(view[CCW[compass+6]].food == 0)) {
		return {cell:CCW[compass+6], type:ANT_WILLIAM};
	    }
	    break;
	default:
	    break;
	}
    }
    if ((foesTotal == 0) && (friendsTotal == 1)) {
	if (view[CCW[compass+2]].food > 0) {
	    // this needs to have precedence, to avoid a deadlock
	    return {cell:CCW[compass+2]};
	} else if ((view[CCW[compass+3]].food +
		    view[CCW[compass+4]].food > 0) &&
		   (view[CCW[compass+1]].color != LCL_LS_FOOD)) {
	    // Stay put, forcing a turn towards the food -- exept, to
	    // avoid another deadlock, when it looks like the navigator
	    // has seen food we cannot see and therefore painted her cell
	    // instead of stepping.
	    return CELL_NOP;
	} else {
	    // fast path: travel straight
	    return {cell:CCW[compass+2]};
	}
    } else if (destOK[CCW[compass+2]] && destOK[CCW[compass+3]]) {
	// Nothing in our way and nothing ominous to our left:
	// travel straight, too.
	return {cell:CCW[compass+2]};
    } else if (destOK[CCW[compass]] && destOK[CCW[compass+7]]) {
	return {cell:CCW[compass]};
    } else if (destOK[CCW[compass+6]]) {
	// emergency back-off cases, losing our navigator
	return {cell:CCW[compass+6]};
    } else if (destOK[CCW[compass+5]]) {
	return {cell:CCW[compass+5]};
    } else if (destOK[CCW[compass+4]]) {
	return {cell:CCW[compass+4]};
    } else {
	return CELL_NOP; // no good options left
    }
}

function runQueenConfusedStrategy() {
    return CELL_NOP; // placeholder
}

// Navigator's strategies

function runNavLightspeedStrategy() {
    // Assert:  compass is set, queen and myself mutually at CCW[compass+1]
    // (facing in opposite directions).
    debugme("Lightspeed navigator...");
    if ((foesTotal == 0) && (friendsTotal == 1)) {
	if (view[CCW[compass]].food > 0) {
	    // this needs to have precedence, to avoid a deadlock
	    return {cell:CCW[compass]};
	} else if (view[CCW[compass+7]].food +
		   view[CCW[compass+6]].food > 0) {
	    // Tell the queen to turn towards it, and let her know that
	    // we haven't moved forward.
	    return {cell:POS_CENTER, color:LCL_LS_FOOD};
	} else {
	    return {cell:CCW[compass]};
	}
    } else {
	// The navigator at this point can't see far in the direction we
	// want to travel.  Some praying is involved...
	if (destOK[CCW[compass]]) {
	    return {cell:CCW[compass]};
	} else if (destOK[CCW[compass+2]]) {
	    // try turning away from them
	    return {cell:CCW[compass+2]};
	}
    }
    return CELL_NOP; // fallback
}

// Individual painters' strategies:
// An orphaned navigator will turn into painter Paul.

function runPaulPaintingStrategy() {
    // Painters of each kind prefer to be solitary...
    if (adjFriends[myType] > 0) {
	return (runSolitaryPainterTactic());
    }
    return (runPaulPaintingTactic());
}

// Mark's strategies

function runMarkPaintingStrategy() {
    if (adjFriends[myType] > 0) {
	return (runSolitaryPainterTactic());
    }
    return (runMarkPaintingTactic());
}

// Georges' strategies

function runGeorgesPaintingStrategy() {
    if (adjFriends[myType] > 0) {
	return (runSolitaryPainterTactic());
    }
    // #### future cooperative cases...
    return (runGeorgesPaintingTactic());
}

// William's strategies

function runWilliamPaintingStrategy() {
    if (adjFriends[myType] > 0) {
	return (runSolitaryPainterTactic());
    }
    // #### future cooperative cases...
    return (runWilliamPaintingTactic());
}

// Painter team strategies:
// Claude, teamed with Jean

function runClaudePaintingStrategy() {
    // Assert:  myType == ANT_MARK;  adjFriends[ANT_GEORGES] == 1;
    // adjFriends[ANT_WILLIAM] == 0;  adjFriends[ANT_MARK] == 0.
    // Locate our buddy first.
    var phase = 0;
    for (var i = 0; i < TOTAL_NBRS; i++) {
	if (view[CCW[i]].ant && view[CCW[i]].ant.friend &&
	    (view[CCW[i]].ant.type == ANT_GEORGES)) {
	    compass = i & 6;
	    phase = i & 1;
	    break;
	}
    }
    // Assert:  compass is set.
    debugme("Claude: compass is set at " + compass + ", phase " + phase);
    if ((phase == 1) &&
	(myColor == view[CCW[compass+7]].color) &&
	(view[CCW[compass]].color == view[CCW[compass+1]].color)) {
	if (destOK[CCW[compass+3]]) {
	    // step forward
	    return {cell:CCW[compass+3]};
	} else if (destOK[CCW[compass]]) {
	    // obstructed... initiate a turn
	    return {cell:CCW[compass]};
	} else if (destOK[CCW[compass+5]]) {
	    // part company, one way or another
	    return {cell:CCW[compass+5]};
	} else if (destOK[CCW[compass+4]]) {
	    return {cell:CCW[compass+4]};
	} else if (destOK[CCW[compass+6]]) {
	    return {cell:CCW[compass+6]};
	} else {
	    return CELL_NOP;
	}
    } else {
	return {cell:CCW[compass+7], color:myColor};
    }
    return CELL_NOP; // notreached
}

// Jean, teamed with Claude

function runJeanPaintingStrategy() {
    // Assert:  myType == ANT_GEORGES;  adjFriends[ANT_MARK] == 1;
    // adjFriends[ANT_WILLIAM] == 0;  adjFriends[ANT_GEORGES] == 0.
    var phase = 0;
    for (var i = 0; i < TOTAL_NBRS; i++) {
	if (view[CCW[i]].ant && view[CCW[i]].ant.friend &&
	    (view[CCW[i]].ant.type == ANT_MARK)) {
	    compass = i & 6;
	    phase = i & 1;
	    break;
	}
    }
    // Assert:  compass is set.
    debugme("Jean: compass is set at " + compass + ", phase " + phase);
    if (phase == 0) {
	if (destOK[CCW[compass+7]]) {
	    // step forward
	    return {cell:CCW[compass+7]};
	} else if (destOK[CCW[compass+1]]) {
	    // initiate a turn
	    return {cell:CCW[compass+1]};
	} else if (destOK[CCW[compass+4]]) {
	    // part company, one way or another
	    return {cell:CCW[compass+4]};
	} else if (destOK[CCW[compass+5]]) {
	    return {cell:CCW[compass+5]};
	} else if (destOK[CCW[compass+6]]) {
	    return {cell:CCW[compass+6]};
	} else {
	    return CELL_NOP;
	}
    } else {
	return {cell:CCW[compass+3], color:myColor};
    }
    return CELL_NOP; // fallback
}

// General painter strategies

function runPainterEatingStrategy() {
    // Assert:  myFood == 0;  foodTotal > 0.
    // Food we can eat becomes food unavailable to everybody else...
    // Every little bit might help.
    for (var i = 0; i < TOTAL_NBRS; i++) {
	if ((view[CCW[i]].food > 0) && destOK[CCW[i]]) {
	    return {cell:CCW[i]};
	}
    }
    return CELL_NOP; // notreached
}

// ---- Decision tree: fourth (tactical) level ----

// Queen's tactics

function runQueenScramblingEatingTactic() {
    // Part of fast path, still need to orient ourselves.
    // Assert:  unobstructed, food available.
    if (myColor != LCL_TRAIL) { // paint trail, fast
	return {cell:POS_CENTER, color:LCL_TRAIL};
    }
    for (var i = 0; i < TOTAL_NBRS; i++) {
	if (view[CCW[i]].food > 0) {
	    // grab the first we identify
	    return {cell:CCW[i]};
	}
    }
    return CELL_NOP; // notreached
}

function runQueenScramblingSnatchingTactic() {
    // Assert:  Food in view, and one or more enemy queens in view and
    // no enemy workers.  Still need to orient ourselves.
    // Don't wait to paint our current cell -- just grab the food.
    // (The destOK check is paranoia;  if the cell contained food
    // and an ant, the food would have been eaten already.)
    for (var i = 0; i < TOTAL_NBRS; i++) {
	if ((view[CCW[i]].food > 0) && (destOK[CCW[i]])) {
	    // grab it
	    return {cell:CCW[i]};
	}
    }
    return CELL_NOP; // notreached
}

function runQueenScramblingTrailCheckTactic() {
    // Assert:  unobstructed; myColor != LCL_TRAIL
    // Still need to orient ourselves.
    if ((myColor != LCL_CLEAR) && (specNbrs[myColor] >= 4)) {
	debugme("Queen:  Yuck!");
	// Oooh, we've stepped into gooo.
	// Add some blooh to help us find a better direction on the next move.
	if (specNbrs[LCL_TRAIL] == 0) {
	    // We don't know where we are anyway...
	    return {cell:POS_CENTER, color:LCL_TRAIL};
	} else if (specNbrs[LCL_TRAIL] >= 3) {
	    // Beam me up...
	    return {cell:POS_CENTER, color:LCL_TRAIL};
	} else {
	    // Loop will find something since at most two neighbor cells
	    // can already be trail-colored:
	    for (var i = 0; i < TOTAL_NBRS; i++) {
		if ((view[CCW[i]].color == LCL_TRAIL) &&
		    (view[CCW[i+2]].color != LCL_TRAIL)) {
		    return {cell:CCW[i+2], color:LCL_TRAIL};
		}
	    }
	    return CELL_NOP; // notreached
	}
    } else if (specNbrs[LCL_TRAIL] == 1) {
	// Don't end up following somebody else's trail when we've
	// stepped straight onto the beginning of it and it runs
	// precisely along the line we're aiming for.  But we do want
	// to be able to cross foreign diagonal trails at right angles,
	// and once we've painted the cell we're on, we can no longer
	// distinguish these two cases.  So...
	for (var i = 0; i < TOTAL_NBRS; i++) {
	    if ((view[CCW[i]].color == LCL_TRAIL) &&
		(view[CCW[i+4]].color != LCL_CLEAR)) {
		// Retreat to a white cell next to our last trail cell
		// in view, if there is one, and reconsider the situation
		// from there on the next turn
		if (view[CCW[i+1]].color == LCL_CLEAR) {
		    return { cell:CCW[i+1]};
		} else if (view[CCW[i+7]].color == LCL_CLEAR) {
		    return { cell:CCW[i+7]};
		} else {
		    // Back to plan A:  mark our present cell.
		    return {cell:POS_CENTER, color:LCL_TRAIL};
		}
	    }
	}
	// Back to plan A:  mark our present cell.
	return {cell:POS_CENTER, color:LCL_TRAIL};
    } else {
	// Back to plan A:  mark our present cell.
	return {cell:POS_CENTER, color:LCL_TRAIL};
    }
    return CELL_NOP; // notreached
}

function runQueenScramblingAroundTactic() {
    // Assert unobstructed, myColor == LCL_TRAIL
    // Still need to orient ourselves.  Find a promising direction.
    // First attempt, intentionally lopsided:
    for (var i = 0; i < TOTAL_NBRS; i++) {
	if ((view[CCW[i]].color == LCL_CLEAR) &&
	    (view[CCW[i+1]].color == LCL_CLEAR) &&
	    (view[CCW[i+2]].color == LCL_CLEAR)) {
	    if ((view[CCW[i+3]].color == LCL_CLEAR) &&
		(view[CCW[i+4]].color == LCL_CLEAR)) {
		return {cell:CCW[i+2]};
	    }
	    return {cell:CCW[i+1]};
	}
    }
    // Second attempt - look for the first neighbor cell that's white
    // or a foreign color, for variety turning clockwise:
    for (i = TOTAL_NBRS - 1; i >= 0; i--) {
	if (view[CCW[i]].color != LCL_TRAIL) {
	    return {cell:CCW[i]};
	}
    }
    // Meh, we're painted in.  Erase something that isn't our color:
    for (i = 0; i < TOTAL_NBRS; i++) {
	if (view[CCW[i]].color != LCL_TRAIL) {
	    return {cell:CCW[i], color:LCL_CLEAR};
	}
    }
    // Still no cigar, we seem to have painted ourselves in.
    // Erase *something*.  We'll step that way on our next move in the
    // hope that things will look better from there.
    return {cell:0, color:LCL_CLEAR};
}

function runQueenScramblingEvasionTactic() {
    // Assert:  Enemies in view  (there can't be any friends yet).
    // Evasion takes precedence over eating and over painting.
    if (specNbrs[LCL_TRAIL] > 0) {
	// still need to orient ourselves
	for (var i = 0; i < TOTAL_NBRS; i++) {
	    if (view[CCW[i]].color == LCL_TRAIL) {
		compass = i & 6; // ignore the LSB
	    }
	} // Assert:  compass is set now
	if ( destOK[CCW[compass+7]] && destOK[CCW[compass]] &&
	     destOK[CCW[compass+1]] && destOK[CCW[compass+2]] &&
	     destOK[CCW[compass+3]] ) {
	    // Move down if other ants are only in  (one or more of)
	    // the upper three cells.
	    // This case and the next keep the trail-colored cell in view
	    // (unless it gets overpainted before our next turn).
	    return {cell:CCW[compass+1]};
	} else if (destOK[CCW[compass+5]] && destOK[CCW[compass+6]] &&
		   destOK[CCW[compass+7]] && destOK[CCW[compass]] &&
		   destOK[CCW[compass+1]]) {
	    // Move down if other ants are only in the righthand three cells...
	    return {cell:CCW[compass+7]};
	} else if (destOK[CCW[compass+3]] && destOK[CCW[compass+4]] &&
		   destOK[CCW[compass+5]]) {
	    // ...carry on to upper right if three adjacent cells are clear, etc...
	    return {cell:CCW[compass+4]};
	} else if (destOK[CCW[compass+5]] && destOK[CCW[compass+6]] &&
		   destOK[CCW[compass+7]]) {
	    // ...turn to upper left...
	    return {cell:CCW[compass+6]};
	} else if (destOK[CCW[compass+1]] && destOK[CCW[compass+2]] &&
		   destOK[CCW[compass+3]]) {
	    // ...turn to lower right...
	    return {cell:CCW[compass+2]};
	} else if (destOK[CCW[compass+7]] && destOK[CCW[compass]] &&
		   destOK[CCW[compass+1]]) {
	    // ...double back (sigh)...
	    return {cell:CCW[compass]};
	} else {
	    // ...or aim in any unoccupied direction (if there is one).
	    for (i = 0; i < TOTAL_NBRS; i++) {
		if (destOK[CCW[i]]) {
		    return {cell:CCW[i]};
		}
	    }
	    return CELL_NOP;
	}
    } else { // lost sight of trail, too
	// Aim into empty space, as far as possible.
	for (var i = 0; i < TOTAL_NBRS; i++) {
	    if (destOK[CCW[i]] && destOK[CCW[i+1]] &&
		destOK[CCW[i+2]] && destOK[CCW[i+3]] &&
		destOK[CCW[i+4]]) {
		return {cell:CCW[i+2]};
	    }
	}
	for (i = 0; i < TOTAL_NBRS; i++) {
	    if (destOK[CCW[i]] && destOK[CCW[i+1]] &&
		destOK[CCW[i+2]]) {
		return {cell:CCW[i+1]};
	    }
	}
	for (i = 0; i < TOTAL_NBRS; i++) {
	    if (destOK[CCW[i]]) {
		return {cell:CCW[i]};
	    }
	}
	return CELL_NOP;
    }
    return CELL_NOP; // notreached
}

// Paul's tactics

function runPaulPaintingTactic() {
    // Assert:  No other ANT_NAVIGATOR in view.
    if (specLateral[myColor] == 0) {
	return {cell:1, color:myColor};
    }
    for (var i = 1; i < TOTAL_NBRS; i+=2) {
	if (view[CCW[i]].color == myColor) {
	    compass = i & 6;
	    break;
	}
    }
    var col1 = (myColor + 1) % 8 + 1;
    if ((view[CCW[compass+5]].color == myColor) &&
	(view[CCW[compass+3]].color == col1) &&
	(view[CCW[compass+7]].color != col1)) {
	// Oops, we were upside down.
	compass = (compass + 4) % 8;
    }
    // Assert:  compass is set.
    debugme("Paul: compass is set at " + compass);
    if (view[CCW[compass+7]].color != col1) {
	return {cell:CCW[compass+7], color:col1};
    } else if (view[CCW[compass]].color != col1) {
	return {cell:CCW[compass], color:col1};
    }
    var col2 = (myColor + 5) % 8 + 1;
    if (view[CCW[compass+3]].color != col2) {
	return {cell:CCW[compass+3], color:col2};
    } else if (view[CCW[compass+2]].color != col2) {
	return {cell:CCW[compass+2], color:col2};
    } else if (view[CCW[compass+5]].color != myColor) {
	return {cell:CCW[compass+5], color:myColor};
    } else if (view[CCW[compass+4]].color != col2) {
	return {cell:CCW[compass+4], color:col2};
	// Ensuring also that CCW[compass+6] was col1-hued would rigidify
	// the navigation and prevent accidental confused turns, but a
	// modest amount of kinkyness seems preferable here.
    } else if (destOK[CCW[compass+5]]) {
	return {cell:CCW[compass+5]};
    } else {
	return (runWanderingPainterTactic()); // fallback
    }
}

// Mark's tactics

function runMarkPaintingTactic() {
    // Assert:  No other ANT_MARK in view.
    switch (specTotal[myColor]) {
    case 9:
	// break up a totally uniform area
	var col = ((myColor + 2) % 8) + 1;
	return {cell:CCW[0], color:col};
    case 8:
	// find the off-color cell and add either add another or walk
	for (var i = 0; i < TOTAL_NBRS; i++) {
	    var col = view[CCW[i]].color;
	    if (col != myColor) {
		if (i == 0) {
		    return {cell:POS_CENTER, color:col};
		} else if ((i == 1) && destOK[CCW[i+3]]) {
		    return {cell:CCW[i+3]};
		} else if ((i == 2) && destOK[CCW[i+5]]) {
		    return {cell:CCW[i+5]};
		} else {
		    return {cell:CCW[i-1], color:col};
		}
	    }
	}
	break; // notreached
    case 7:
	// random walk
	return runWanderingPainterTactic();
    case 6:
	// find an off-color cell and add either adjust it or walk
	for (var i = 0; i < TOTAL_NBRS; i++) {
	    if (view[CCW[i]].color != myColor) {
		if ((i == 0) && destOK[CCW[i+5]]) {
		    return {cell:CCW[i+5]};
		} else if ((i == 1) && destOK[CCW[i+4]]) {
		    return {cell:CCW[i+4]};
		} else {
		    return {cell:CCW[i], color:myColor};
		}
	    }
	}
	break; // notreached
    case 5:
    case 4:
    case 3:
	// find an off-color cell and adjust it
	for (var i = 0; i < TOTAL_NBRS; i++) {
	    if (view[CCW[i]].color != myColor) {
		return {cell:CCW[i], color:myColor};
	    }
	}
	break; // notreached
    case 2:
    case 1:
    default:
	// look for a majority color around us
	for (var i = TOTAL_NBRS - 1; i >= 0; i--) {
	    var col = view[CCW[i]].color;
	    if ((col == myColor) &&
		(specTotal[view[CCW[i+4]].color] == 7) &&
		destOK[CCW[i+4]]) {
		// follow a trail
		return {cell:CCW[i+4]};
	    }
	    if (specTotal[col] >= 3) {
		return {cell:POS_CENTER, color:col};
	    }
	}
	// no clear majority -- just duplicate an arbitrary cell color
	var col = view[CCW[1]].color;
	if (view[CCW[0]].color != col) {
	    return {cell:CCW[0], color:col};
	} else if (view[CCW[2]].color != col) {
	    return {cell:CCW[2], color:col};
	}
	break; // notreached
    }
    return (runWanderingPainterTactic());
}

// Georges's tactics

function runGeorgesPaintingTactic() {
    // Assert:  No other ANT_GEORGES in view.
    var col = 0;
    for (var c0 = view[CCW[0]].color; c0 < view[CCW[0]].color + 8; c0++) {
	var c = (c0 % 8) + 1;
	if (specNbrs[c] == 0) {
	    col = c;
	}
    }
    if (col == 0) {
	return (runWanderingPainterTactic());
    }
    for (var i = 0; i < TOTAL_NBRS; i++) {
	if (specNbrs[view[CCW[i]].color] > 1) {
	    return {cell:CCW[i], color:col};
	}
    }
    return (runWanderingPainterTactic());
}

function runWilliamPaintingTactic() {
    // Assert:  No other ANT_WILLIAM in view.
    var col = ((myColor + 6) % 8) + 1;
    if (specTotal[myColor] == 9) {
	// break up a totally uniform area
	return {cell:CCW[0], color:col};
    }
    var myRand = (view[CCW[0]].color + specTotal[view[CCW[2]].color]) % 3;
    switch (myRand) {
    case 0:
	for (var i = 0; i < TOTAL_NBRS; i+=2) {
	    if (destOK[CCW[i]]) {
		return {cell:CCW[i]};
	    }
	}
	break;
    case 1:
	if (view[CCW[1]].color != view[CCW[7]].color) {
	    return {cell:CCW[1], color:view[CCW[7]].color};
	} else if (view[CCW[5]].color != view[CCW[3]].color) {
	    return {cell:CCW[5], color:view[CCW[3]].color};
	}
	break;
    case 2:
	if (view[CCW[5]].color != view[CCW[3]].color) {
	    return {cell:CCW[5], color:view[CCW[3]].color};
	} else if (view[CCW[1]].color != view[CCW[7]].color) {
	    return {cell:CCW[1], color:view[CCW[7]].color};
	}
	break;
    default:
	break; // notreached
    }
    for (var i = 1; i < TOTAL_NBRS; i+=2) {
	if (destOK[CCW[i]]) {
	    return {cell:CCW[i]};
	}
    }
    return (runWanderingPainterTactic());
}

// General painters' tactics

function runSolitaryPainterTactic() {
    // assert:  adjFriends[myType] > 0
    for (var i = 0; i < TOTAL_NBRS; i++) {
	if (view[CCW[i]].ant && view[CCW[i]].ant.friend &&
	    (view[CCW[i]].ant.type == myType)) {
	    if (destOK[CCW[i+4]]) {
		return {cell:CCW[i+4]};
	    } else if (destOK[CCW[i+3]]) {
		return {cell:CCW[i+3]};
	    } else if (destOK[CCW[i+5]]) {
		return {cell:CCW[i+5]};
	    } else if (destOK[CCW[i+2]]) {
		return {cell:CCW[i+2]};
	    } else if (destOK[CCW[i+6]]) {
		return {cell:CCW[i+6]};
	    } else if (destOK[CCW[i+1]]) {
		return {cell:CCW[i+1]};
	    }
	}
    }
    return CELL_NOP; // hemmed in
}

function runWanderingPainterTactic() {
    for (var i = 0; i < TOTAL_NBRS; i++) {
	if (destOK[CCW[i]]) {
	    return {cell:CCW[i]};
	}
    }
    return CELL_NOP;
}

// ---- Helper functions ----

// Spectral analysis:

// ####


// console.log wrapper:
function debugme(arg) {
    if (DEBUGME[myType]) {
	console.log(arg);
    }
}
