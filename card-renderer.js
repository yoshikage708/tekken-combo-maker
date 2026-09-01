function canvasArrow(c,x,y,size,dir,filled,masked=false){const angles={'6':0,'3':45,'2':90,'1':135,'4':180,'7':225,'8':270,'9':315};c.save();c.translate(x+size/2,y+size/2);c.rotate((angles[dir]||0)*Math.PI/180);c.beginPath();c.moveTo(-size*.42,-size*.15);c.lineTo(size*.08,-size*.15);c.lineTo(size*.08,-size*.34);c.lineTo(size*.43,0);c.lineTo(size*.08,size*.34);c.lineTo(size*.08,size*.15);c.lineTo(-size*.42,size*.15);c.closePath();if(filled){c.fillStyle='#f5f7fa';c.fill()}else{if(masked){c.fillStyle='#171d24';c.fill()}c.strokeStyle='#f5f7fa';c.lineWidth=2;c.stroke()}c.restore()}
function canvasNumpad(c,x,y,size,label,held=false){c.fillStyle=held?'#f1b84b':'#f5f7fa';c.font=`900 ${Math.round(size*.7)}px Inter,"Yu Gothic",sans-serif`;c.textAlign='center';c.textBaseline='middle';c.fillText(label,x+size/2,y+size/2+2);c.textAlign='left';c.textBaseline='alphabetic'}
function canvasAttack(c,x,y,label){const dots=attackDots[label]||[0,0,0,0],r=8,gap=20;dots.forEach((on,i)=>{const cx=x+(i%2)*gap+r,cy=y+Math.floor(i/2)*gap+r;c.beginPath();c.arc(cx,cy,r,0,Math.PI*2);c.fillStyle=on?'#f5f7fa':'#171d24';c.fill();c.strokeStyle='#f5f7fa';c.lineWidth=1.8;c.stroke()});c.fillStyle='#b8c0cc';c.font=`800 ${label.length>6?10:14}px "Yu Gothic",sans-serif`;c.textAlign='center';c.fillText(label,x+18,y+50);c.textAlign='left'}
function canvasAttackMini(c,x,y,label){const dots=attackDots[label]||[0,0,0,0],r=3.5,gap=9;dots.forEach((on,i)=>{c.beginPath();c.arc(x+(i%2)*gap+r,y+Math.floor(i/2)*gap+r,r,0,Math.PI*2);c.fillStyle=on?'#f5f7fa':'#171d24';c.fill();c.strokeStyle='#f5f7fa';c.lineWidth=1;c.stroke()});c.fillStyle='#c6ced8';c.font='800 8px "Yu Gothic",sans-serif';c.textAlign='center';c.fillText(label,x+8,y+22);c.textAlign='left'}
function canvasTag(c,x,y,label,color){c.font='800 18px "Yu Gothic",sans-serif';const w=c.measureText(label).width+34;c.fillStyle=color;c.beginPath();c.roundRect(x,y,w,34,17);c.fill();c.fillStyle='#fff';c.textAlign='center';c.fillText(label,x+w/2,y+23);c.textAlign='left';return w}
function drawMemoCanvas(c,text,startX,startY,maxWidth,lineHeight,maxLines=2){let x=startX,y=startY,line=0;c.font='500 21px "Yu Gothic",sans-serif';const newline=()=>{x=startX;y+=lineHeight;line++};for(const part of memoParts(text||'')){if(line>=maxLines)break;if(part.type==='text'){for(const ch of [...part.text]){if(ch==='\n'){newline();continue}const w=c.measureText(ch).width;if(x+w>startX+maxWidth)newline();if(line>=maxLines)break;c.fillStyle='#f5f7fa';c.fillText(ch,x,y);x+=w}}else{const w=part.type==='footnote'?38:part.type==='direction'?29:30;if(x+w>startX+maxWidth)newline();if(line>=maxLines)break;if(part.type==='footnote'){c.fillStyle='#173d49';c.beginPath();c.roundRect(x-2,y-21,w,24,12);c.fill();c.strokeStyle='#58bfd8';c.lineWidth=1.2;c.stroke();c.fillStyle='#a8efff';c.font='900 12px "Yu Gothic",sans-serif';c.textAlign='center';c.fillText(`※${part.label}`,x-2+w/2,y-5);c.textAlign='left'}else{if(!(part.type==='direction'&&directionDisplay==='numpad')){c.fillStyle='#151b22';c.beginPath();c.roundRect(x-2,y-22,w,27,5);c.fill()}if(part.type==='direction'){if(directionDisplay==='numpad')canvasNumpad(c,x+2,y-20,20,part.label,false);else if(part.label==='☆'){c.fillStyle='#f5f7fa';c.font='20px "Yu Gothic",sans-serif';c.fillText('☆',x+3,y-2)}else canvasArrow(c,x+2,y-20,20,part.label,false)}else canvasAttackMini(c,x+5,y-19,part.label)}x+=w+4;c.font='500 21px "Yu Gothic",sans-serif'}}}
function drawComboIcons(c,startX,startY,maxX){
  let x=startX,y=startY;const rowHeight=70,rangeSegments=new Map;
  combo.forEach(item=>{
    let baseWidth=0,code='',caption='';
    if(item.type==='direction')baseWidth=58;
    else if(item.type==='attack')baseWidth=64;
    else if(item.type==='separator')baseWidth=42;
    else if(item.type==='slide')baseWidth=48;
    else if(item.type==='movement'&&(item.label==='前ステ'||item.label==='バクステ'))baseWidth=78;
    else if(item.type==='stateTag'||item.type==='state'){c.font='800 17px "Yu Gothic",sans-serif';baseWidth=c.measureText(item.label).width+44}
    else{code=item.code||named[item.label]?.[0]||item.label;caption=item.caption||named[item.label]?.[1]||'';c.font='900 29px "Yu Gothic",sans-serif';baseWidth=Math.max(105,Math.min(210,Math.max(c.measureText(code).width+26,caption.length*17)))}
    const countWidth=item.count>1?54:0,annotationWidths=(item.annotations||[]).map(note=>{c.font='800 14px "Yu Gothic",sans-serif';return Math.min(180,c.measureText(note).width+24)+8}),groupWidth=baseWidth+countWidth+annotationWidths.reduce((sum,width)=>sum+width,0);
    if(x+groupWidth>maxX&&x>startX){x=startX;y+=rowHeight}
    const groupX=x,groupY=y;
    if(item.footnote&&!item.footnoteGroup){c.fillStyle='rgba(40,118,136,.12)';c.beginPath();c.roundRect(groupX-6,groupY-3,groupWidth+12,62,12);c.fill();c.strokeStyle='#58bfd8';c.lineWidth=1.5;c.stroke()}
    let tx=x,ty=y;
    if(item.type==='direction'){
      if(directionDisplay==='numpad')canvasNumpad(c,tx,ty+4,42,item.label,item.hold)
      else if(item.label==='☆'){c.fillStyle='#f5f7fa';c.font='400 44px "Yu Gothic",sans-serif';c.fillText('☆',tx,ty+42)}else canvasArrow(c,tx,ty+4,42,item.label,item.hold)
    }else if(item.type==='attack'){
      canvasAttack(c,tx+4,ty+2,item.label)
    }else if(item.type==='separator'){
      c.fillStyle='#e6333e';c.font='900 40px "Yu Gothic",sans-serif';c.fillText('›',tx+8,ty+40)
    }else if(item.type==='slide'){
      c.fillStyle='#f5f7fa';c.font='900 42px "Yu Gothic",sans-serif';c.fillText(item.label,tx+2,ty+42)
    }else if(item.type==='movement'&&(item.label==='前ステ'||item.label==='バクステ')){
      const dir=item.label==='前ステ'?'6':'4';if(directionDisplay==='numpad'){c.fillStyle='#f5f7fa';c.font='900 30px Inter,"Yu Gothic",sans-serif';c.textAlign='center';c.fillText(`${dir}${dir}`,tx+32,ty+34)}else{canvasArrow(c,tx,ty+3,34,dir,false);canvasArrow(c,tx+20,ty+3,34,dir,false,true)}c.fillStyle='#b8c0cc';c.font='700 12px "Yu Gothic",sans-serif';c.textAlign='center';c.fillText(item.label,tx+32,ty+57);c.textAlign='left'
    }else if(item.type==='stateTag'||item.type==='state'){
      canvasTag(c,tx,ty+10,item.label,'#326f78')
    }else{
      c.fillStyle='#f5f7fa';c.font='900 29px "Yu Gothic",sans-serif';c.textAlign='center';c.fillText(code,tx+baseWidth/2,ty+30);c.fillStyle='#b8c0cc';c.font='700 15px "Yu Gothic",sans-serif';c.fillText(caption,tx+baseWidth/2,ty+53);c.textAlign='left'
    }
    x+=baseWidth;
    if(item.count>1){c.fillStyle='#f1b84b';c.font='900 23px "Yu Gothic",sans-serif';c.fillText(`×${item.count}`,x+2,y+35);x+=countWidth}
    (item.annotations||[]).forEach((note,index)=>{const total=annotationWidths[index],w=total-8;c.fillStyle='#543b18';c.beginPath();c.roundRect(x,y+14,w,27,7);c.fill();c.fillStyle='#ffd98a';c.font='800 14px "Yu Gothic",sans-serif';c.textAlign='center';c.fillText(note,x+w/2,y+33);c.textAlign='left';x+=total})
    if(item.footnote&&!item.footnoteGroup){c.font='900 13px "Yu Gothic",sans-serif';const mark=`※${item.footnote}`,mw=c.measureText(mark).width+14,mx=groupX+3,my=groupY-15;c.fillStyle='#173d49';c.beginPath();c.roundRect(mx,my,mw,24,12);c.fill();c.strokeStyle='#58bfd8';c.lineWidth=1.5;c.stroke();c.fillStyle='#a8efff';c.textAlign='center';c.fillText(mark,mx+mw/2,my+16);c.textAlign='left'}
    if(item.footnoteGroup){if(!rangeSegments.has(item.footnoteGroup))rangeSegments.set(item.footnoteGroup,{number:item.footnote,rows:new Map});const group=rangeSegments.get(item.footnoteGroup),row=group.rows.get(groupY);if(row){row.left=Math.min(row.left,groupX);row.right=Math.max(row.right,groupX+groupWidth)}else group.rows.set(groupY,{left:groupX,right:groupX+groupWidth,top:groupY})}
    x+=4;
  });
  rangeSegments.forEach(group=>{[...group.rows.values()].sort((a,b)=>a.top-b.top).forEach((row,index)=>{c.fillStyle='rgba(40,118,136,.12)';c.beginPath();c.roundRect(row.left-6,row.top-3,row.right-row.left+12,62,12);c.fill();c.strokeStyle='#58bfd8';c.lineWidth=1.5;c.stroke();if(index===0){c.font='900 13px "Yu Gothic",sans-serif';const mark=`※${group.number}`,mw=c.measureText(mark).width+14,mx=row.left-3,my=row.top-15;c.fillStyle='#173d49';c.beginPath();c.roundRect(mx,my,mw,24,12);c.fill();c.strokeStyle='#58bfd8';c.stroke();c.fillStyle='#a8efff';c.textAlign='center';c.fillText(mark,mx+mw/2,my+16);c.textAlign='left'}})});
  if(!combo.length){c.fillStyle='#9ca6b5';c.font='700 28px "Yu Gothic",sans-serif';c.fillText('コンボ未入力',startX,startY+36)}
  return y+62;
}
function savePngIcons(){
  const canvas=document.createElement('canvas');canvas.width=1200;canvas.height=630;
  const c=canvas.getContext('2d'),font='"Noto Sans JP","Yu Gothic",sans-serif',stringMode=currentMode==='string';
  const accent=stringMode?'#2aa6a4':'#e6333e',glowColor=stringMode?'#123f46':'#52171d';
  c.fillStyle='#080a0d';c.fillRect(0,0,1200,630);
  const glow=c.createRadialGradient(1050,0,0,1050,0,520);glow.addColorStop(0,glowColor);glow.addColorStop(1,'#080a0d');c.fillStyle=glow;c.fillRect(0,0,1200,630);
  c.fillStyle=accent;c.fillRect(55,50,8,530);c.fillStyle='#171d24';c.beginPath();c.roundRect(63,50,1082,530,22);c.fill();
  c.fillStyle='#f5f7fa';c.font=`900 44px ${font}`;c.fillText($('#character').value.trim()||'CHARACTER',105,125);
  c.fillStyle='#9ca6b5';c.font=`700 17px ${font}`;c.fillText(stringMode?'STRING GUIDE':'COMBO GUIDE',105,155);
  if(!stringMode){c.textAlign='right';c.fillText('DAMAGE',1095,92);c.fillStyle='#f1b84b';c.font=`900 58px ${font}`;c.fillText($('#damage').value||'0',1095,148);c.textAlign='left'}
  const context=activeContextTag();canvasTag(c,360,116,context.label,context.color);
  c.strokeStyle='#2d3540';c.beginPath();c.moveTo(105,184);c.lineTo(1100,184);c.stroke();
  const comboLayer=document.createElement('canvas');comboLayer.width=1020;comboLayer.height=620;const lc=comboLayer.getContext('2d'),comboBottom=drawComboIcons(lc,10,20,1005),contentHeight=Math.max(82,comboBottom+10),availableHeight=215,comboScale=Math.min(1,availableHeight/contentHeight);c.drawImage(comboLayer,0,0,1020,contentHeight,105,195,1020*comboScale,contentHeight*comboScale);
  c.beginPath();c.moveTo(105,420);c.lineTo(1100,420);c.stroke();c.fillStyle='#9ca6b5';c.font=`700 16px ${font}`;
  if(stringMode){c.fillText('連携メモ',105,462);drawMemoCanvas(c,$('#notes').value.trim()||'メモなし',105,500,990,30,2)}else{c.fillText('難易度',105,462);c.fillText('MEMO',340,462);c.fillStyle='#f5f7fa';c.font=`800 25px ${font}`;c.fillText($('#difficulty').value,105,503);drawMemoCanvas(c,$('#notes').value.trim()||'メモなし',340,500,755,30,2)}
  c.fillStyle=accent;c.font=`900 18px ${font}`;c.fillText('TEKKEN 8 COMBO CARD MAKER / CCM',105,555);
  const a=document.createElement('a'),safe=($('#character').value.trim()||'card').replace(/[\\/:*?"<>|]/g,'-'),kind=stringMode?'string':'combo';a.download=`${safe}-${kind}.png`;a.href=canvas.toDataURL('image/png');a.click();say(`${stringMode?'連携':'コンボ'}画像を作成しました`)
}
const isIOS=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1),isMobile=isIOS||/Android/i.test(navigator.userAgent);
async function savePngForDevice(){let captured=null;const originalClick=HTMLAnchorElement.prototype.click;HTMLAnchorElement.prototype.click=function(){captured=this};try{savePngIcons()}finally{HTMLAnchorElement.prototype.click=originalClick}if(!captured)return;const kind=currentMode==='string'?'連携':'コンボ';if(!isMobile||!navigator.share){captured.click();say(`${kind}画像をダウンロードしました`);return}try{const blob=await fetch(captured.href).then(r=>r.blob()),file=new File([blob],captured.download||'ccm-card.png',{type:'image/png'});if(navigator.canShare?.({files:[file]})){await navigator.share({files:[file],title:`CCM ${kind}カード`});say('共有メニューを開きました。保存先を選べます');return}}catch(error){if(error?.name==='AbortError'){say('保存をキャンセルしました');return}}captured.click();say(`${kind}画像をダウンロードしました`)}
