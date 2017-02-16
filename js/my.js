class CellClick extends React.Component{
  constructor(props) {
    super(props);
    this.cellClick=this.cellClick.bind(this);
  }
  cellClick(){
    this.props.cellClick(this.props['data-key']);
  }
  render(){
    const cellValue=this.props.cellValue;
    return (
      <div onClick={this.cellClick} className={cellValue==1?'red inCell':'black inCell'}></div>
    )
  }
}

class GameManage extends React.Component{
  constructor(){
    super();
    this.run=this.run.bind(this);
    this.pause=this.pause.bind(this);
    this.clear=this.clear.bind(this);
    this.startRun = this.startRun.bind(this);
    this.cellClick=this.cellClick.bind(this);
    //create a two-dimension array for init
    let cellCols = cols,cellRows=rows,i=0,j=0,curCells=[];
    for(i=0;i<cellRows;i++){
      let tempR=[];
      for(j=0;j<cellCols;j++){
        tempR.push(0);
      }
      curCells.push(tempR);
    }
    /*let temp=0;//generate random array
    for(i=0;i<cellRows;i++){
      let tempArr=[];
      for(j=0;j<cellCols;j++){
        temp=Math.round(Math.random());
        tempArr.push(temp);
      }
      curCells.push(tempArr);
    }*/
    this.state={
      curCells:curCells,
      cellCols:cellCols,
      cellRows:cellRows,
      simSpeed:0,
      runState:0,//0 for still alive ,1 for all dead
      generation:0,
      arrIndex:true//true for thirdArray,false for nextArray
    }
   //console.log(curCells);
 }
  run(){
    this.startRun();
    timer = window.setInterval(function(){
      if(this.state.runState==0){
      this.startRun();
      }
    }.bind(this),50);
  }
  startRun(){
      //get the next array
      let curArray = this.state.curCells,arrFlag=this.state.arrIndex,tempNext=[];
      if(arrFlag){
        tempNext=nextArray;
      }else {
        tempNext=thirdArray;
      }
      let i=0,j=0,iMinus=0,jMinus=0,iPlus=0,jPlus=0,len=this.state.cellCols,hei=this.state.cellRows,val=0,rezult=0;
      for(i=0;i<hei;i++){
        for(j=0;j<len;j++){
          val = curArray[i][j];
          iMinus=(i==0)?(hei-1):(i-1);
          jMinus=(j==0)?(len-1):(j-1);
          iPlus=(i+1==hei)?0:(i+1);
          jPlus=(j+1==len)?0:(j+1);
          rezult = curArray[iMinus][jMinus]+curArray[iMinus][j]+curArray[iMinus][jPlus]+curArray[i][jMinus]+curArray[i][jPlus]+curArray[iPlus][jMinus]+curArray[iPlus][j]+curArray[iPlus][jPlus];
          /*if(i==5){
            console.log('here');
          }*/
          if(rezult ==3 ||(val==1&&rezult==2) ){
            tempNext[i][j]=1;
          }else{tempNext[i][j]=0;}
        }
      }
      //if all dead ,stop
      let allDead = true;
      outerLoop:
      for(i=0;i<hei;i++){
        for(j=0;j<len;j++){
          if(tempNext[i][j]==1){
            allDead=false;
            break outerLoop;
          }
        }
      }
      //change state
      let geneNew = this.state.generation + 1,nextIndex=!arrFlag,rState=0;
      if(allDead){
        rState = 1;
        //geneNew=0;
      }
      this.setState({
        curCells:tempNext,
        runState:rState,
        generation:geneNew,
        arrIndex:nextIndex
      });
      //console.log("startRun");
  }
  pause(){
    clearInterval(timer);
    this.setState({
      runState:1
    });
    //console.log('pause');
  }
  clear(){
    clearInterval(timer);
    let arrFlag=this.state.arrIndex,temparray=[],len=this.state.cellCols,hei=this.state.cellRows,i=0,j=0;
    if(arrFlag){
      temparray=nextArray;
    }else {
      temparray=thirdArray;
    }
    for(i=0;i<hei;i++){
      for(j=0;j<len;j++){
        temparray[i][j]=0;
      }
    }
    this.setState({
      curCells:temparray,
      runState:1,
      generation:0,
      arrIndex:!arrFlag
    })
  }
  cellClick(val){
    let len=this.state.cellCols,hei=this.state.cellRows,i=Math.floor(val/len),j=val%len;
    //setState
    const clickArray = this.state.curCells;
    clickArray[i][j] = 1 - clickArray[i][j];
    this.setState({
      curCells:clickArray
    });
  }
  render(){
    //curCells->divs
    let cells=[];
    let i=0,j=0,len=this.state.cellCols,narray=this.state.curCells,tempValue=0;
    const cellArray = narray.map(function(ele,ind){
      let cellRow = ele.map(function(e,i){
          tempValue=narray[ind][i];
          return (<div className="cell" key={ind*len+i}><CellClick data-key={ind*len+i} cellClick={this.cellClick} cellValue={tempValue} /></div>);
        },this);
      return <div className='cellRow' key={ind}>{cellRow}</div>;
    },this);
    return (
      <div>
        <div id='ctrBtns'>
          <button className='btn btn-danger' onClick={this.run}>Run</button>
          <button className='btn btn-primary' onClick={this.pause}>Pause</button>
          <button className='btn btn-primary' onClick={this.clear}>Clear</button>
          <span>Generations:{this.state.generation}</span>
        </div>
        <div><div id='cells' cellClick={this.cellClick}>{cellArray}</div></div>
        <div>
        <div id='config'>
          <div id='sizeCtr'>
            <span>Board Size:</span>
            <button className='btn btn-primary'>Size:50X30</button>
            <button className='btn btn-primary'>Size:60X40</button>
            <button className='btn btn-primary'>Size:80X50</button>
          </div>
          <div id='speedCtr'>
            <span>Sim Speed:</span>
            <button className='btn btn-primary'>Slow</button>
            <button className='btn btn-primary'>Medium</button>
            <button className='btn btn-primary'>Fast</button>
          </div>
        </div>
        </div>
     </div>
    );
  }
}

let nextArray = [],thirdArray = [],emptyArray=[],timer;
let cols=50,rows=30,i=0,j=0;
for(i=0;i<rows;i++){
  let temp=[];
  for(j=0;j<cols;j++){
    temp.push(0);
  }
  nextArray.push(temp);
}
for(i=0;i<rows;i++){
  let temp=[];
  for(j=0;j<cols;j++){
    temp.push(0);
  }
  thirdArray.push(temp);
}

ReactDOM.render(
  <GameManage />,
  document.getElementById('game')
);
