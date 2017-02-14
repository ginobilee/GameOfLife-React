class GameManage extends React.Component{
  constructor(){
    super();
    this.run=this.run.bind(this);
    this.pause=this.pause.bind(this);
    this.clear=this.clear.bind(this);
    //create a two-dimension array for init
    let cellCols = 10,cellRows=8,i=0,j=0,curCells=[];
    for(i=0;i<cellRows;i++){
      let tempR=[];
      for(j=0;j<cellCols;j++){
        tempR.push(0);
      }
      curCells.push(tempR);
    }
    curCells[4][5]=1;
    curCells[5][5]=1;
    curCells[4][6]=1;
    curCells[4][7]=1;
    /*for(i=0;i<cellRows;i++){
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
      runState:0,
      generation:0,
      arrIndex:true
    }
   //console.log(curCells);
 }
 componentDidMount(){
   //this.run();
 }
  run(){
    let rState = this.state.runState;
    if(rState==0){
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
          if(i==5){
            console.log('here');
          }
          if(rezult ==3 ||(val==1&&rezult==2) ){
            tempNext[i][j]=1;
          }else{tempNext[i][j]=0;}
        }
      }
      //change state
      let geneNew = this.state.generation + 1,nextIndex=!arrFlag;
      this.setState({
        curCells:tempNext,
        generation:geneNew,
        arrIndex:nextIndex
      });
    }
  }
  pause(){}
  clear(){}
  render(){
    //curCells->divs
    let cells=[];
    let i=0,j=0,len=this.state.cellCols,height=this.state.cellRows,narray=this.state.curCells;
    const cellArray = narray.map(function(ele){
      let cellRow = ele.map(function(e){
          return (<div className={e==1?"red cell":"cell"}></div>);
        });
      return <div className='cellRow'>{cellRow}</div>;
    });
    return (
      <div>
        <div id='ctrBtns'>
          <button className='btn btn-danger' onClick={this.run}>Run</button>
          <button className='btn btn-primary' onClick={this.pause}>Pause</button>
          <button className='btn btn-primary' onClick={this.clear}>Clear</button>
          <span>Generations:{this.state.generation}</span>
        </div>
        <div id='cells'>{cellArray}</div>
        <div id='config'>
          <div id='sizeCtr'>
            <span>Board Size:</span>
            <button className='btn btn-primary'>Size:50X30</button>
            <button className='btn btn-primary'>Size:50X30</button>
            <button className='btn btn-primary'>Size:50X30</button>
          </div>
          <div id='speedCtr'>
            <span>Sim Speed:</span>
            <button className='btn btn-primary'>Slow</button>
            <button className='btn btn-primary'>Medium</button>
            <button className='btn btn-primary'>Fast</button>
          </div>
        </div>
     </div>
    );
  }
}

let nextArray = [],thirdArray = [];
let cols=10,rows=8,i=0,j=0;
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
