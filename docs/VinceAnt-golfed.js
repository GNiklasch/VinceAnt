var ANV=1;var AMK=2;var AGS=3;var AWM=4;var AQ=5;var THC=1;var TH1=15;var RM=7;var PW=1;var PY=2;var PP=3;var PC=4;var PR=5;var PG=6;var PB=7;var PK=8;var LCLR=PW;var LT=PY;var LLSF=PP;var TN=8;var POSC=4;var NOP={cell:POSC};var CCW=[6,7,8,5,2,1,0,3,6,7,8,5,2,1,0,3,6,7,8,5,2,1];
var xn=-1;var here=view[POSC];var mC=here.color;var myself=here.ant;var mT=myself.type;var mF=myself.food;var mS=(mT!=AQ&&mF>0);var dOK=[true,true,true,true,true,true,true,true,true];
var uo=true;var sL=[0,0,0,0,0,0,0,0,0];var sD=[0,0,0,0,0,0,0,0,0];var sN=[0,0,0,0,0,0,0,0,0];var sT=[0,0,0,0,0,0,0,0,0];var fdL=0;var fdD=0;var fdT=0;sT[mC]++;for (i=0; i<TN; i+=2){var cell=view[CCW[i]];sD[cell.color]++;sN[cell.color]++;sT[cell.color]++;if (cell.food>0){fdD++;fdT++;if (mS){dOK[CCW[i]]=false;uo=false;}}}for (i=1; i<TN; i+=2){var cell=view[CCW[i]];sL[cell.color]++;sN[cell.color]++;sT[cell.color]++;if (cell.food>0){fdL++;fdT++;if (mS){dOK[CCW[i]]=false;uo=false;}}}var aF=[0,0,0,0,0,0];var aLF=[0,0,0,0,0,0];var aUF=[0,0,0,0,0,0];var fT=0;var mQ=0;var aE=[0,0,0,0,0,0];var aLE=[0,0,0,0,0,0];var aUE=[0,0,0,0,0,0];var eT=0;for (i=0; i<TN; i++){var cell=view[CCW[i]];if (cell.ant){if (cell.ant.friend){aF[cell.ant.type]++;fT++;if (cell.ant.type==AQ){xn=i&6;mQ=i&1;}if (cell.ant.food>0){aLF[cell.ant.type]++;} else {aUF[cell.ant.type]++;}} else {aE[cell.ant.type]++;eT++;if (cell.ant.food>0){aLE[cell.ant.type]++;} else {aUE[cell.ant.type]++;}}dOK[CCW[i]]=false;uo=false;}}switch (mT){case AQ:return (rQSs());case ANV:return (rNSs());case AMK:return (rMSs());case AGS:return (rGSs());case AWM:return (rWSs());default:return NOP;}function rQSs(){switch (aF[ANV]){case 0:return (rQScrSy());case 1:for (var i=0; i<TN; i++){var cell=view[CCW[i]];if (cell.ant&&cell.ant.friend&&cell.ant.type==ANV){xn=i&6;if (i&1){return (rQLsSy());} else {return (rQCSy());}}}break;default:for (var i=0; i<TN; i++){var cell=view[CCW[i]];if (cell.ant&&cell.ant.friend&&cell.ant.type==ANV){if (i&1){if (dOK[CCW[i-1]]){return {cell:CCW[i-1]};} else if (dOK[CCW[i+1]]){return {cell:CCW[i+1]};} else if (dOK[CCW[i+4]]){return {cell:CCW[i+4]};} else {return NOP;}} else {if (dOK[CCW[i+7]]){return {cell:CCW[i+7]};} else if (dOK[CCW[i+1]]){return {cell:CCW[i+1]};} else if (dOK[CCW[i+4]]){return {cell:CCW[i+4]};} else {return NOP;}}}}return (rQCSy());}return NOP;}function rNSs(){if (aF[AQ]>0){return (rSLSy());} else if ((mF==0)&&(fdT>0)){return (rPEgSy());} else {return (rPPgSy());}}function rMSs(){if ((aF[AQ]>0)&&(mF==0)){if (dOK[CCW[xn+4]]){return {cell:CCW[xn+4]};} else if (dOK[CCW[xn+3]]){return {cell:CCW[xn+3]};} else if (dOK[CCW[xn+5]]){return {cell:CCW[xn+5]};} else if (dOK[CCW[xn+2]]){return {cell:CCW[xn+2]};} else {return NOP;}} else if ((mF==0)&&(fdT>0)){return (rPEgSy());} else if ((aF[AGS]==1)&&(aF[AWM]==0)){return (rCPgSy());} else {return (rMPgSy());}}function rGSs(){if ((aF[AQ]>0)&&(mF==0)){if (dOK[CCW[xn+4]]){return {cell:CCW[xn+4]};} else if (dOK[CCW[xn+3]]){return {cell:CCW[xn+3]};} else if (dOK[CCW[xn+5]]){return {cell:CCW[xn+5]};} else if (dOK[CCW[xn+2]]){return {cell:CCW[xn+2]};} else {return NOP;}} else if ((mF==0)&&(fdT>0)){return (rPEgSy());} else if ((aF[AMK]==1)&&(aF[AWM]==0)){return (rJPgSy());} else {return (rGPgSy());}}function rWSs(){if ((aF[AQ]>0)&&(mF==0)){if (dOK[CCW[xn+4]]){return {cell:CCW[xn+4]};} else if (dOK[CCW[xn+3]]){return {cell:CCW[xn+3]};} else if (dOK[CCW[xn+5]]){return {cell:CCW[xn+5]};} else if (dOK[CCW[xn+2]]){return {cell:CCW[xn+2]};} else {return NOP;}} else if ((mF==0)&&(fdT>0)){return (rPEgSy());} else {return (rWPgSy());}}function rQScrSy(){if (uo){if (fdT>0){return (rQSETc());} else if (mF>=THC){for (var i=0; i<TN; i+=2){if ((view[CCW[i]].color==LT)||(view[CCW[i+1]].color==LT)){return {cell:CCW[i+1],type:ANV};}}return {cell:1,type:ANV};} else if (mC!=LT){if ((mC==LCLR)||(sN[LCLR]>=TN-1)){return {cell:POSC,color:LT};} else {return (rQSTCTc());}} else if ((sN[LCLR]>=4)&&(sN[LT]==1)){for (var i=0; i<TN; i+=2){if ((view[CCW[i]].color==LT)||(view[CCW[i+1]].color==LT)){return {cell:CCW[i+4]};}}} else if (sN[LCLR]==TN){return {cell:0};} else {return (rQSATc());}} else {if ((fdT>0)&&(eT>0)&&(eT==aE[AQ])){return (rQSSTc());} else {return (rQSEvTc());}}return NOP;}function rQLsSy(){if ((sT[LCLR]<=2)&&(mF>=TH1)&&(eT==0)){switch (mF % RM){case AMK:if ((aF[AMK]==0)&&dOK[CCW[xn+6]]&&(view[CCW[xn+6]].food==0)){return {cell:CCW[xn+6],type:AMK};}break;case AGS:if ((aF[AGS]==0)&&dOK[CCW[xn+5]]&&(view[CCW[xn+5]].food==0)){return {cell:CCW[xn+5],type:AGS};}break;case AWM:if ((aF[AWM]==0)&&dOK[CCW[xn+6]]&&(view[CCW[xn+6]].food==0)){return {cell:CCW[xn+6],type:AWM};}break;default:break;}}if ((eT==0)&&(fT==1)){if (view[CCW[xn+2]].food>0){return {cell:CCW[xn+2]};} else if ((view[CCW[xn+3]].food +view[CCW[xn+4]].food>0)&&(view[CCW[xn+1]].color!=LLSF)){return NOP;} else {return {cell:CCW[xn+2]};}} else if (dOK[CCW[xn+2]]&&dOK[CCW[xn+3]]){return {cell:CCW[xn+2]};} else if (dOK[CCW[xn]]&&dOK[CCW[xn+7]]){return {cell:CCW[xn]};} else if (dOK[CCW[xn+6]]){return {cell:CCW[xn+6]};} else if (dOK[CCW[xn+5]]){return {cell:CCW[xn+5]};} else if (dOK[CCW[xn+4]]){return {cell:CCW[xn+4]};} else {return NOP;}}function rQCSy(){return NOP;}function rSLSy(){if ((eT==0)&&(fT==1)){if (view[CCW[xn]].food>0){return {cell:CCW[xn]};} else if (view[CCW[xn+7]].food +view[CCW[xn+6]].food>0){return {cell:POSC,color:LLSF};} else {return {cell:CCW[xn]};}} else {if (dOK[CCW[xn]]){return {cell:CCW[xn]};} else if (dOK[CCW[xn+2]]){return {cell:CCW[xn+2]};}}return NOP;}function rPPgSy(){if (aF[mT]>0){return (rSPTc());}return (rPPgTc());}function rMPgSy(){if (aF[mT]>0){return (rSPTc());}return (rMPgTc());}function rGPgSy(){if (aF[mT]>0){return (rSPTc());}return (rGPgTc());}function rWPgSy(){if (aF[mT]>0){return (rSPTc());}return (rWPgTc());}function rCPgSy(){var phase=0;for (var i=0; i<TN; i++){if (view[CCW[i]].ant&&view[CCW[i]].ant.friend&&
(view[CCW[i]].ant.type==AGS)){xn=i&6;phase=i&1;break;}}if ((phase==1)&&(mC==view[CCW[xn+7]].color)&&(view[CCW[xn]].color==view[CCW[xn+1]].color)){if (dOK[CCW[xn+3]]){return {cell:CCW[xn+3]};} else if (dOK[CCW[xn]]){return {cell:CCW[xn]};} else if (dOK[CCW[xn+5]]){return {cell:CCW[xn+5]};} else if (dOK[CCW[xn+4]]){return {cell:CCW[xn+4]};} else if (dOK[CCW[xn+6]]){return {cell:CCW[xn+6]};} else {return NOP;}} else {return {cell:CCW[xn+7],color:mC};}return NOP;}function rJPgSy(){var phase=0;for (var i=0; i<TN; i++){if (view[CCW[i]].ant&&view[CCW[i]].ant.friend&&
(view[CCW[i]].ant.type==AMK)){xn=i&6;phase=i&1;break;}}if (phase==0){if (dOK[CCW[xn+7]]){return {cell:CCW[xn+7]};} else if (dOK[CCW[xn+1]]){return {cell:CCW[xn+1]};} else if (dOK[CCW[xn+4]]){return {cell:CCW[xn+4]};} else if (dOK[CCW[xn+5]]){return {cell:CCW[xn+5]};} else if (dOK[CCW[xn+6]]){return {cell:CCW[xn+6]};} else {return NOP;}} else {return {cell:CCW[xn+3],color:mC};}return NOP;}function rPEgSy(){for (var i=0; i<TN; i++){if ((view[CCW[i]].food>0)&&dOK[CCW[i]]){return {cell:CCW[i]};}}return NOP;}function rQSETc(){if (mC!=LT){return {cell:POSC,color:LT};}for (var i=0; i<TN; i++){if (view[CCW[i]].food>0){return {cell:CCW[i]};}}return NOP;}function rQSSTc(){for (var i=0; i<TN; i++){if ((view[CCW[i]].food>0)&&(dOK[CCW[i]])){return {cell:CCW[i]};}}return NOP;}function rQSTCTc(){if ((mC!=LCLR)&&(sN[mC]>=4)){if (sN[LT]==0){return {cell:POSC,color:LT};} else if (sN[LT]>=3){return {cell:POSC,color:LT};} else {for (var i=0; i<TN; i++){if ((view[CCW[i]].color==LT)&&(view[CCW[i+2]].color!=LT)){return {cell:CCW[i+2],color:LT};}}return NOP;}} else if (sN[LT]==1){for (var i=0; i<TN; i++){if ((view[CCW[i]].color==LT)&&(view[CCW[i+4]].color!=LCLR)){if (view[CCW[i+1]].color==LCLR){return { cell:CCW[i+1]};} else if (view[CCW[i+7]].color==LCLR){return { cell:CCW[i+7]};} else {return {cell:POSC,color:LT};}}}return {cell:POSC,color:LT};} else {return {cell:POSC,color:LT};}return NOP;}function rQSATc(){for (var i=0; i<TN; i++){if ((view[CCW[i]].color==LCLR)&&(view[CCW[i+1]].color==LCLR)&&(view[CCW[i+2]].color==LCLR)){if ((view[CCW[i+3]].color==LCLR)&&(view[CCW[i+4]].color==LCLR)){return {cell:CCW[i+2]};}return {cell:CCW[i+1]};}}for (i=TN-1; i>=0; i--){if (view[CCW[i]].color!=LT){return {cell:CCW[i]};}}for (i=0; i<TN; i++){if (view[CCW[i]].color!=LT){return {cell:CCW[i],color:LCLR};}}return {cell:0,color:LCLR};}function rQSEvTc(){if (sN[LT]>0){for (var i=0; i<TN; i++){if (view[CCW[i]].color==LT){xn=i&6;}}if ( dOK[CCW[xn+7]]&&dOK[CCW[xn]]&&dOK[CCW[xn+1]]&&dOK[CCW[xn+2]]&&dOK[CCW[xn+3]] ){return {cell:CCW[xn+1]};} else if (dOK[CCW[xn+5]]&&dOK[CCW[xn+6]]&&dOK[CCW[xn+7]]&&dOK[CCW[xn]]&&dOK[CCW[xn+1]]){return {cell:CCW[xn+7]};} else if (dOK[CCW[xn+3]]&&dOK[CCW[xn+4]]&&dOK[CCW[xn+5]]){return {cell:CCW[xn+4]};} else if (dOK[CCW[xn+5]]&&dOK[CCW[xn+6]]&&dOK[CCW[xn+7]]){return {cell:CCW[xn+6]};} else if (dOK[CCW[xn+1]]&&dOK[CCW[xn+2]]&&dOK[CCW[xn+3]]){return {cell:CCW[xn+2]};} else if (dOK[CCW[xn+7]]&&dOK[CCW[xn]]&&dOK[CCW[xn+1]]){return {cell:CCW[xn]};} else {for (i=0; i<TN; i++){if (dOK[CCW[i]]){return {cell:CCW[i]};}}return NOP;}} else {for (var i=0; i<TN; i++){if (dOK[CCW[i]]&&dOK[CCW[i+1]]&&dOK[CCW[i+2]]&&dOK[CCW[i+3]]&&dOK[CCW[i+4]]){return {cell:CCW[i+2]};}}for (i=0; i<TN; i++){if (dOK[CCW[i]]&&dOK[CCW[i+1]]&&dOK[CCW[i+2]]){return {cell:CCW[i+1]};}}for (i=0; i<TN; i++){if (dOK[CCW[i]]){return {cell:CCW[i]};}}return NOP;}return NOP;}function rPPgTc(){if (sL[mC]==0){return {cell:1,color:mC};}for (var i=1; i<TN; i+=2){if (view[CCW[i]].color==mC){xn=i&6;break;}}var col1=(mC+1) % 8+1;if ((view[CCW[xn+5]].color==mC)&&(view[CCW[xn+3]].color==col1)&&(view[CCW[xn+7]].color!=col1)){xn=(xn+4) % 8;}if (view[CCW[xn+7]].color!=col1){return {cell:CCW[xn+7],color:col1};} else if (view[CCW[xn]].color!=col1){return {cell:CCW[xn],color:col1};}var col2=(mC+5) % 8+1;if (view[CCW[xn+3]].color!=col2){return {cell:CCW[xn+3],color:col2};} else if (view[CCW[xn+2]].color!=col2){return {cell:CCW[xn+2],color:col2};} else if (view[CCW[xn+5]].color!=mC){return {cell:CCW[xn+5],color:mC};} else if (view[CCW[xn+4]].color!=col2){return {cell:CCW[xn+4],color:col2};} else if (dOK[CCW[xn+5]]){return {cell:CCW[xn+5]};} else {return (rWgPTc());}}function rMPgTc(){switch (sT[mC]){case 9:var col=((mC+2) % 8)+1;return {cell:CCW[0],color:col};case 8:for (var i=0; i<TN; i++){var col=view[CCW[i]].color;if (col!=mC){if (i==0){return {cell:POSC,color:col};} else if ((i==1)&&dOK[CCW[i+3]]){return {cell:CCW[i+3]};} else if ((i==2)&&dOK[CCW[i+5]]){return {cell:CCW[i+5]};} else {return {cell:CCW[i-1],color:col};}}}break;case 7:return rWgPTc();case 6:for (var i=0; i<TN; i++){if (view[CCW[i]].color!=mC){if ((i==0)&&dOK[CCW[i+5]]){return {cell:CCW[i+5]};} else if ((i==1)&&dOK[CCW[i+4]]){return {cell:CCW[i+4]};} else {return {cell:CCW[i],color:mC};}}}break;case 5:case 4:case 3:for (var i=0; i<TN; i++){if (view[CCW[i]].color!=mC){return {cell:CCW[i],color:mC};}}break;case 2:case 1:default:for (var i=TN-1; i>=0; i--){var col=view[CCW[i]].color;if ((col==mC)&&(sT[view[CCW[i+4]].color]==7)&&dOK[CCW[i+4]]){return {cell:CCW[i+4]};}if (sT[col]>=3){return {cell:POSC,color:col};}}var col=view[CCW[1]].color;if (view[CCW[0]].color!=col){return {cell:CCW[0],color:col};} else if (view[CCW[2]].color!=col){return {cell:CCW[2],color:col};}break;}return (rWgPTc());}function rGPgTc(){var col=0;for (var c0=view[CCW[0]].color; c0<view[CCW[0]].color+8; c0++){var c=(c0 % 8)+1;if (sN[c]==0){col=c;}}if (col==0){return (rWgPTc());}for (var i=0; i<TN; i++){if (sN[view[CCW[i]].color]>1){return {cell:CCW[i],color:col};}}return (rWgPTc());}function rWPgTc(){var col=((mC+6) % 8)+1;if (sT[mC]==9){return {cell:CCW[0],color:col};}var myRand=(view[CCW[0]].color+sT[view[CCW[2]].color]) % 3;
switch (myRand){case 0:for (var i=0; i<TN; i+=2){if (dOK[CCW[i]]){return {cell:CCW[i]};}}break;case 1:if (view[CCW[1]].color!=view[CCW[7]].color){return {cell:CCW[1],color:view[CCW[7]].color};} else if (view[CCW[5]].color!=view[CCW[3]].color){return {cell:CCW[5],color:view[CCW[3]].color};}break;case 2:if (view[CCW[5]].color!=view[CCW[3]].color){return {cell:CCW[5],color:view[CCW[3]].color};} else if (view[CCW[1]].color!=view[CCW[7]].color){return {cell:CCW[1],color:view[CCW[7]].color};}break;default:break;}for (var i=1; i<TN; i+=2){if (dOK[CCW[i]]){return {cell:CCW[i]};}}return (rWgPTc());}function rSPTc(){for (var i=0; i<TN; i++){if (view[CCW[i]].ant&&view[CCW[i]].ant.friend&&
(view[CCW[i]].ant.type==mT)){if (dOK[CCW[i+4]]){return {cell:CCW[i+4]};} else if (dOK[CCW[i+3]]){return {cell:CCW[i+3]};} else if (dOK[CCW[i+5]]){return {cell:CCW[i+5]};} else if (dOK[CCW[i+2]]){return {cell:CCW[i+2]};} else if (dOK[CCW[i+6]]){return {cell:CCW[i+6]};} else if (dOK[CCW[i+1]]){return {cell:CCW[i+1]};}}}return NOP;}function rWgPTc(){for (var i=0; i<TN; i++){if (dOK[CCW[i]]){return {cell:CCW[i]};}}return NOP;}