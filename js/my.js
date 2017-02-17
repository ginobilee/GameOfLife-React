class GameManage extends React.Component{
  constructor(){
    super();
    this.run=this.run.bind(this);
    this.pause=this.pause.bind(this);
    this.clear=this.clear.bind(this);
    this.startRun = this.startRun.bind(this);
    this.cellClick=this.cellClick.bind(this);
    this.changeSize=this.changeSize.bind(this);
    //create two arrays to store changes
    let curArray = [],nextArray = [],cols=80,rows=50,i=0,j=0;//init for the biggest area
    for(i=0;i<rows;i++){
      let temp=[];
      for(j=0;j<cols;j++){
        temp.push(Math.round(Math.random()));
        //temp.push(0);
      }
      curArray.push(temp);
    }
    //set a complexed start

    for(i=0;i<rows;i++){
      let temp=[];
      for(j=0;j<cols;j++){
        temp.push(0);
      }
      nextArray.push(temp);
    }
    this.state={
      curCells:curArray,
      nextCells:nextArray,
      cellCols:cols,
      cellRows:rows,
      simSpeed:0,
      runState:0,//0 for still alive ,1 for all dead
      generation:0
    }
   //console.log(curCells);
 }
  run(){
    this.startRun();
  }
  startRun(){
      //get the next array
      console.log(Date.now()+':startRun begins and generation is :'+this.state.generation);
      this.timer && clearTimeout(this.timer);
      let curArray = this.state.curCells,nextArray = this.state.nextCells,tempNext=[];
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
            nextArray[i][j]=1;
          }else{nextArray[i][j]=0;}
        }
      }
      //console.log(Date.now()+':computing completed');
      //if all dead ,stop
      let allDead = true;
      outerLoop:
      for(i=0;i<hei;i++){
        for(j=0;j<len;j++){
          if(nextArray[i][j]==1){
            allDead=false;
            break outerLoop;
          }
        }
      }
      //change state
      let geneNew = this.state.generation + 1,rState=0;
      if(allDead){
        rState = 1;
        //geneNew=0;
      }
      console.log(Date.now()+':startRun completed before setState');
      this.setState({
        curCells:nextArray,
        nextCells:curArray,
        runState:rState,
        generation:geneNew
      });

  }
  pause(){
    this.timer && clearTimeout(this.timer);
    this.setState({
      runState:1
    });
    //console.log('pause');
  }
  clear(){
    this.timer && clearTimeout(this.timer);
    let temparray=this.state.curCells,len=this.state.cellCols,hei=this.state.cellRows,i=0,j=0;
    for(i=0;i<hei;i++){
      for(j=0;j<len;j++){
        temparray[i][j]=0;
      }
    }
    this.setState({
      curCells:temparray,
      runState:1,
      generation:0,
    })
  }
  cellClick(e){
    let str=e.target.getAttribute('data-key');
    let val = parseInt(str);
    let len=this.state.cellCols,hei=this.state.cellRows,i=Math.floor(val/len),j=val%len;
    //setState
    const clickArray = this.state.curCells;
    clickArray[i][j] = 1 - clickArray[i][j];
    this.setState({
      curCells:clickArray
    });
  }
  changeSize(e){
    console.log(Date.now()+':begin change size');
    this.timer && clearTimeout(this.timer);
    //get the current size value
    let len=this.state.cellCols,curSize=0,nextSize=e.target.value;
    switch (len) {
      case 50:
        curSize=1;
        break;
      case 60:
        curSize=2;
        break;
      case 80:
        curSize=3;
        break;
      default:
        curSize=9;
    }
    if(curSize != nextSize){
      //change the size
      let i=0,j=0,nextLen=0,nextHei=0,curArray=this.state.curCells,curNextArray=this.state.nextCells,newCurArr=[],newNextArr=[];
      curArray=null;curNextArray=null;
      switch (nextSize) {
        case '1':
          nextLen=50;nextHei=30;
          break;
        case '2':
          nextLen=60;nextHei=40;
          break;
        case '3':
          nextLen=80;nextHei=50;
          break;
        default:
          nextLen=10;nextHei=8;
      }
      for(i=0;i<nextHei;i++){
        let tempRow=[];
        for(j=0;j<nextLen;j++){
          tempRow.push(0);
        }
        newCurArr.push(tempRow);
      }
      for(i=0;i<nextHei;i++){
        let tempRow=[];
        for(j=0;j<nextLen;j++){
          tempRow.push(0);
        }
        newNextArr.push(tempRow);
      }
      this.setState({
        cellCols:nextLen,
        cellRows:nextHei,
        curCells:newCurArr,
        nextCells:newNextArr,
        runState:1
      })
    }
    console.log(Date.now()+':stopped change size');
  }
  componentDidMount(){
    console.log(Date.now()+':mounted');
  }
  componentDidUpdate(){
    console.log(Date.now()+':generation '+this.state.generation+' updateed');
    if(this.state.runState==0){
      this.timer = window.setTimeout(function(){
        console.log(Date.now()+':updated and generation is: '+this.state.generation);
        this.startRun();
      }.bind(this),5);
    }
  }
  render(){
    //curCells->divs
    //console.log(Date.now()+':into render ');
    let cells=[];
    let i=0,j=0,len=this.state.cellCols,hei=this.state.cellRows,narray=this.state.curCells,tempValue=0,oneDimArr=[];
    const cellArray = narray.map(function(ele,ind){
      let cellRow = ele.map(function(e,i){
          tempValue=narray[ind][i];
          return (<div className={tempValue==0?'inCell black':'inCell red'} key={ind*len+i} data-key={ind*len+i} onClick={this.cellClick}></div>);
        },this);
      return <div className='cellRow' key={ind}>{cellRow}</div>;
    },this);
    //console.log(Date.now()+':complete array building');
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
            <button className='btn btn-primary' onClick={this.changeSize} value='1'>Size:50X30</button>
            <button className='btn btn-primary' onClick={this.changeSize} value='2'>Size:60X40</button>
            <button className='btn btn-primary' onClick={this.changeSize} value='3'>Size:80X50</button>
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



ReactDOM.render(
  <GameManage />,
  document.getElementById('game')
);
