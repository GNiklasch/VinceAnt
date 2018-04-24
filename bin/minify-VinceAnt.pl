#!/usr/bin/perl

while (<>) {
    s/^\s+//;
    s!\s*//.*$!!;
    s/ANT_NAVIGATOR/ANV/g;
    s/ANT_MARK/AMK/g;
    s/ANT_GEORGES/AGS/g;
    s/ANT_WILLIAM/AWM/g;
    s/ANT_QUEEN/AQ/g;
    s/^.*(DEBUGME|debugme).*;$//g; # needs manual work
    s/THRESHOLD/TH/g;
    s/RATCHET_MODULUS/RM/g;
    s/SPONSORED_ARTIST_TYPE/SPDAT/g;
    s/COL_WHITE/PW/g;
    s/COL_YELLOW/PY/g;
    s/COL_PURPLE/PP/g;
    s/COL_CYAN/PC/g;
    s/COL_RED/PR/g;
    s/COL_GREEN/PG/g;
    s/COL_BLUE/PB/g;
    s/COL_BLACK/PK/g;
    s/LCL_TRAIL/LT/g;
    s/LCL_LS_FOOD/LLSF/g;
    s/LCL_CLEAR/LCLR/g;
    s/TOTAL_NBRS/TN/g;
    s/POS_CENTER/POSC/g;
    s/CELL_NOP/NOP/g;

    s/compass/xn/g;
    s/myColor/mC/g;
    s/myType/mT/g;
    s/myFood/mF/g;
    s/amNotHungry/mS/g;
    s/adjFriends/aF/g;
    s/adjLadenFriends/aLF/g;
    s/adjUnladenFriends/aUF/g;
    s/friendsTotal/fT/g;
    s/myQueenPos/mQ/g;
    s/adjFoes/aE/g;
    s/adjLadenFoes/aLE/g;
    s/adjUnladenFoes/aUE/g;
    s/foesTotal/eT/g;
    s/destOK/dOK/g;
    s/unobstructed/uo/g;
    s/specLateral/sL/g;
    s/specDiagonal/sD/g;
    s/specNbrs/sN/g;
    s/specTotal/sT/g;
    s/foodLateral/fdL/g;
    s/foodDiagonal/fdD/g;
    s/foodTotal/fdT/g;

    s/runQueenStrategies/rQSs/g;
    s/runNavStrategies/rNSs/g;
    s/runMarkStrategies/rMSs/g;
    s/runGeorgesStrategies/rGSs/g;
    s/runWilliamStrategies/rWSs/g;

    s/runQueenScramblingStrategy/rQScrSy/g;
    s/runQueenLightspeedStrategy/rQLsSy/g;
    s/runQueenConfusedStrategy/rQCSy/g;
    s/runNavLightspeedStrategy/rSLSy/g;
    s/runNavRecoveryStrategy/rNRSy/g;
    s/runPainterEatingStrategy/rPEgSy/g;
    s/runPainterMatchingStrategy/rPMgSy/g;
    s/runPaulPaintingStrategy/rPPgSy/g;
    s/runClaudePaintingStrategy/rCPgSy/g;
    s/runMarkPaintingStrategy/rMPgSy/g;
    s/runJeanPaintingStrategy/rJPgSy/g;
    s/runGeorgesPaintingStrategy/rGPgSy/g;
    s/runWilliamPaintingStrategy/rWPgSy/g;

    s/runQueenScramblingEatingTactic/rQSETc/g;
    s/runQueenScramblingTrailCheckTactic/rQSTCTc/g;
    s/runQueenScramblingAroundTactic/rQSATc/g;
    s/runQueenScramblingSnatchingTactic/rQSSTc/g;
    s/runQueenScramblingEvasionTactic/rQSEvTc/g;
    s/runSolitaryPainterTactic/rSPTc/g;
    s/runPaulPaintingTactic/rPPgTc/g;
    s/runMarkPaintingTactic/rMPgTc/g;
    s/runGeorgesPaintingTactic/rGPgTc/g;
    s/runWilliamPaintingTactic/rWPgTc/g;
    s/runWanderingPainterTactic/rWgPTc/g;

    # specLike... would go here (when needed)

    s/ \= /=/g;
    s/ \!\= /!=/g;
    s/ \=\= /==/g;
    s/ \+\= /+=/g;
    s/ \< /</g;
    s/ \> />/g;
    s/ \<\= /<=/g;
    s/ \>\= />=/g;
    s/ \& /&/g;
    s/ \&\& /&&/g;
    s/ \&\&$/&&/;
    s/ \|\| /||/g;
    s/ \|\|$/||/g;
    s/ \+ /+/g;
    s/ \- /-/g;
    s/[)] [{]/){/g;
    s/[,]\s+/,/g;
    chomp if (length($_) < 48);
    $_ =~ /[{}]$/ && chomp;
    $_ !~ /^$/ && print $_;
}
