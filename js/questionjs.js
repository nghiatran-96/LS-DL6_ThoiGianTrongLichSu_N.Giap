﻿$(window).on('load',function(){
    if (typeof InitMindMapPage !== 'undefined' && $.isFunction(InitMindMapPage)) InitMindMapPage();
    if (typeof InitQuestionPages !== 'undefined' && $.isFunction(InitQuestionPages)) InitQuestionPages();
    if (typeof NextPreviewButtonQuestionPage !== 'undefined' && $.isFunction(NextPreviewButtonQuestionPage)) NextPreviewButtonQuestionPage();
    if (typeof CountAnswerMaxTime !== 'undefined' && $.isFunction(CountAnswerMaxTime)) CountAnswerMaxTime();
    if (typeof RestyleQuesOneChoice !== 'undefined' && $.isFunction(RestyleQuesOneChoice)) RestyleQuesOneChoice();
    if (typeof InitDragableAnswer !== 'undefined' && $.isFunction(InitDragableAnswer)) InitDragableAnswer();
    if (typeof CreatePareConnectCrossAnswer !== 'undefined' && $.isFunction(CreatePareConnectCrossAnswer)) CreatePareConnectCrossAnswer();
$('.ConfirmAnswerLeft_Right_ShowResult').each(function(){if (typeof $(this).parent().parent().parent().parent().attr('groupresultshow') != typeof undefined && $(this).parent().parent().parent().parent().attr('groupresultshow')=='True')$(this).children().first().attr('src','images/showResultActive.png');else $(this).children().first().attr('src','images/showResult.png');});});
// General - Code dùng chung
var answeredQues='';
$('.ConfirmAnswerRight_AllPage').on('click',function(){
    $('#QuestionResultPanel').css('left',($('#leftMainContent').width()-$('#QuestionResultPanel').width())/2 + 'px' );
    $('#QuestionResultPanel').css('top',($('#leftMainContent').height()-$('#QuestionResultPanel').height())/2 + 'px');
    $('#QuestionResultPanel_NoScore').css('left',($('#leftMainContent').width()-$('#QuestionResultPanel_NoScore').width())/2 + 'px');
    $('#QuestionResultPanel_NoScore').css('top',($('#leftMainContent').height()-$('#QuestionResultPanel_NoScore').height())/2 + 'px');
    if (parseFloat($(this).css('opacity'))!=parseFloat(1)) return false;
    stopTime();
    $('#mainBottomBtnPause').css('display','');
    $('#mainBottomBtnPlayPause').css('display','none');
    // Tìm nhóm câu hỏi của trang hiện tại
    var _currentGroup='';
    var _curPage=GetCurrentQuestionPage();
    if (typeof _curPage!=typeof undefined)
    {
        _currentGroup=_curPage.attr('questiongroup');
            $('#leftMainContent').children('.CELPage').each(function(){
                if (typeof $(this).attr('questiongroup') != typeof undefined && $(this).attr('questiongroup')==_currentGroup)
                    RemoveEventAfterConfirm($(this).attr('id'));
            });
        if (_curPage.attr('groupresultshow')=='False')
        {
            $(this).css('opacity',0.6);
            $('#leftMainContent').children('.CELPage').each(function(){
                if (typeof $(this).attr('questiongroup') != typeof undefined && $(this).attr('questiongroup')==_currentGroup)
                {
                    clearInterval(timeQuestionPageInterval);                    $(this).children('.ConfirmAnswer').children('.ConfirmAnswerRight').children().css('opacity',0.6);
                    $(this).attr('mustanswer','False');
                    $(this).attr('lefttime','0');
                    $(this).children().children('.ConfirmAnswerLeft').children('.ConfirmAnswerLeft_Middle').children('.ConfirmAnswerLeft_Middle_Time').children('.ConfirmAnswerLeft_Middle_Time_Right').children().text('00:00');
                    RemoveEventAfterConfirm($(this).attr('id'));
                }
            });
            return false;
        }
        else
        {
            $('#leftMainContent').children('.CELPage').each(function(){
                if (typeof $(this).attr('questiongroup') != typeof undefined && $(this).attr('questiongroup')==_currentGroup)
                    RemoveEventAfterConfirm($(this).attr('id'));
            });
        }
        ConfirmAnswerAllInGroup(_currentGroup,true);
    }
});

function ConfirmAnswerAllInGroup(_currentGroup,_showResult)
{
    var _result=0.0;
    // Tìm toàn bộ các câu trả lời trong nhóm đưa vào chuỗi
    var _allSelectedAns='';
    var _allTrueAns='';
    var _totalQuestion=0;
    var _totalCorrect=0;
    var _curPageAns='';
    var _ansScore=0;
    var _totalScore=0;
    var _passPercent=0;
    var _passMess='';
    var _failMess='';
    $('#leftMainContent').children().each(function(){
        var _style=$(this).attr('questiongroup');
        var _questype=$(this).attr('questype');
        if (_style==_currentGroup){
            clearInterval(timeQuestionPageInterval);
            $(this).attr('leftTime','0');
            $(this).attr('mustanswer','False');
            $(this).children().children('.ConfirmAnswerLeft').children('.ConfirmAnswerLeft_Middle').children('.ConfirmAnswerLeft_Middle_Time').children('.ConfirmAnswerLeft_Middle_Time_Right').children().text('00:00');
            $(this).children('.ConfirmAnswer').children('.ConfirmAnswerRight').children().css('opacity','0.6');
            _totalQuestion++;
            _totalScore+=parseInt($(this).attr('score'));
            _passPercent=parseFloat($(this).attr('passpercent')).toFixed(2);
            _passMess=$(this).attr('passmess');
            _failMess=$(this).attr('failmess');
            if (CheckAnswerByQuesID($(this).attr('id')) == true )
            {
                _totalCorrect++;
                _ansScore+=parseInt($(this).attr('score'));
            }
        }
    });
    if (_showResult==true)
    {
        // Hiển thị khung kết quả
        // Tính điểm không tính %
        if (_totalScore>0 && _passPercent==0){
            HideRowResult_Panel(0);
            var ctr=$('#QuestionResultPanel').children().children().children('.QuestionResultPanelContent_Top_Right').first();
            ctr.children(':eq(0)').text(_currentGroup);ctr.children(':eq(1)').text(_totalQuestion);ctr.children(':eq(2)').text(_totalCorrect);ctr.children(':eq(3)').text(_ansScore+'/'+_totalScore);
            $('#QuestionResultPanel').children().children().children('.QuestionResultPanelContent_Top_Left').first().children(':eq(3)').text('Your score / Maximum score:');
            ctr.children(':eq(4)').text(parseFloat(_ansScore*100/_totalScore).toFixed(2) + '%');
        }
        //Không tính điểm và cả %
        if (_totalScore==0 && _passPercent==0){
            HideRowResult_Panel(1);
            var ctr=$('#QuestionResultPanel').children().children().children('.QuestionResultPanelContent_Top_Right').first();
            ctr.children(':eq(0)').text(_currentGroup);ctr.children(':eq(1)').text(_totalQuestion);ctr.children(':eq(2)').text(_totalCorrect);ctr.children(':eq(3)').text('');
            $('#QuestionResultPanel').children().children().children('.QuestionResultPanelContent_Top_Left').first().children(':eq(3)').text('');
            ctr.children(':eq(4)').text(parseFloat(_totalCorrect*100/_totalQuestion).toFixed(2) + '%');
        }
        // Tính điểm và tính %
        if (_totalScore>0 && _passPercent>0){
            HideRowResult_Panel(2);
            var ctr=$('#QuestionResultPanel_NoScore').children().children().children('.QuestionResultPanelContent_Top_Right_NoScore').first();
            ctr.children(':eq(0)').text(_currentGroup);ctr.children(':eq(1)').text(_totalQuestion);ctr.children(':eq(2)').text(_totalCorrect);ctr.children(':eq(3)').text( _ansScore + '/' + _totalScore);ctr.children(':eq(4)').text(parseFloat(_ansScore*100/_totalScore).toFixed(2) + '%');
            var ctr1=$('#QuestionResultPanel').children().children().children('.QuestionResultPanelContent_Top_Right').first();
            ctr1.children(':eq(0)').text(_currentGroup);ctr1.children(':eq(1)').text(_totalQuestion);ctr1.children(':eq(2)').text(_totalCorrect);ctr1.children(':eq(3)').text(_ansScore + '/' + _totalScore);
            $('#QuestionResultPanel').children().children().children('.QuestionResultPanelContent_Top_Left').first().children(':eq(3)').text('Your score / Maximum score:');
            ctr1.children(':eq(4)').text(parseFloat(_ansScore*100/_totalScore).toFixed(2) + '%');
            if (parseFloat(parseFloat(_ansScore*100/_totalScore).toFixed(2)) >= parseFloat(parseFloat(_passPercent).toFixed(2))){
                $('#QuestionResultPanel_NoScore').children().children('.QuestionResultPanelContent_Middle_NoScore').text(_passMess);
                $('#QuestionResultPanel_NoScore').children().children('.QuestionResultPanelContent_Middle_NoScore').css('color','green');
            }else{
                $('#QuestionResultPanel_NoScore').children().children('.QuestionResultPanelContent_Middle_NoScore').text(_failMess);
                $('#QuestionResultPanel_NoScore').children().children('.QuestionResultPanelContent_Middle_NoScore').css('color','red');
            }
        }
        // Tính % không tính điểm
        if (_totalScore==0 && _passPercent>0){
            HideRowResult_Panel(3);
            var ctr=$('#QuestionResultPanel_NoScore').children().children().children('.QuestionResultPanelContent_Top_Right_NoScore').first();
            ctr.children(':eq(0)').text(_currentGroup);ctr.children(':eq(1)').text(_totalQuestion);ctr.children(':eq(2)').text(_totalCorrect);ctr.children(':eq(3)').text('');
            ctr.children(':eq(4)').text(parseFloat(_totalCorrect*100/_totalQuestion).toFixed(2) + '%');
            var ctr1=$('#QuestionResultPanel').children().children().children('.QuestionResultPanelContent_Top_Right').first();
            ctr1.children(':eq(0)').text(_currentGroup);ctr1.children(':eq(1)').text(_totalQuestion);ctr1.children(':eq(2)').text(_totalCorrect);ctr1.children(':eq(3)').text('');
            $('#QuestionResultPanel').children().children().children('.QuestionResultPanelContent_Top_Left').first().children(':eq(3)').text('');
            ctr1.children(':eq(4)').text(parseFloat(_totalCorrect*100/_totalQuestion).toFixed(2) + '%');
            if (parseFloat(parseFloat(_totalCorrect*100/_totalQuestion).toFixed(2)) >= parseFloat(parseFloat(_passPercent).toFixed(2))){
                $('#QuestionResultPanel_NoScore').children().children('.QuestionResultPanelContent_Middle_NoScore').text(_passMess);
                $('#QuestionResultPanel_NoScore').children().children('.QuestionResultPanelContent_Middle_NoScore').css('color','green');
            }else{
                $('#QuestionResultPanel_NoScore').children().children('.QuestionResultPanelContent_Middle_NoScore').text(_failMess);
                $('#QuestionResultPanel_NoScore').children().children('.QuestionResultPanelContent_Middle_NoScore').css('color','red');
            }
        }
    }
    else
    {
        if (_totalScore>0 && _passPercent==0) _result=parseFloat(_ansScore*100/_totalScore).toFixed(2);
        if (_totalScore>0 && _passPercent>0) _result=parseFloat(_ansScore*100/_totalScore).toFixed(2);
        if (_totalScore==0 && _passPercent>0) _result=parseFloat(_totalCorrect*100/_totalQuestion).toFixed(2);
    }
    $('#leftMainContent').children('.CELPage').each(function(){
        if (typeof $(this).attr('questiongroup') != typeof undefined && $(this).attr('questiongroup')==_currentGroup)
            $(this).children('.ConfirmAnswer').children('.ConfirmAnswerRight').children().css('opacity',0.6);
    });
    return _result;
}
function ShowMessage(type)
{
    var _curPage=GetCurrentPage();
    if (_curPage.attr('questionresultshow') == 'True' || _curPage.attr('groupresultshow') == 'True')
    {
        if (type == 'messmiss')
        {
            $('#ConfirmAnswerRight_OnePage_Content_IMG').attr('src','images/button/Question/messageWarning.png');
            $('#ConfirmAnswerRight_OnePage_Content_Content').text('Bạn phải trả lời câu hỏi trước khi xác nhận!');
        }
        if (type == 'messtrue')
        {
            $('#ConfirmAnswerRight_OnePage_Content_IMG').attr('src','images/button/Question/messageOK.png');
            $('#ConfirmAnswerRight_OnePage_Content_Content').text(_curPage.attr('messtrue'));
        }
        if (type == 'messfail')
        {
            $('#ConfirmAnswerRight_OnePage_Content_IMG').attr('src','images/button/Question/messageWrong.png');
            $('#ConfirmAnswerRight_OnePage_Content_Content').text(_curPage.attr('messfalse'));
        }
        if (type == 'timeout')
        {
            $('#ConfirmAnswerRight_OnePage_Content_IMG').attr('src','images/button/Question/messageTimeout.png');
            $('#ConfirmAnswerRight_OnePage_Content_Content').text(_curPage.attr('messmiss'));
        }
        if ( typeof _curPage.attr('messmiss')!=typeof undefined || typeof _curPage.attr('messfalse')!= typeof undefined || typeof _curPage.attr('messtrue')!=typeof undefined )
        {
            if ($('#ConfirmAnswerRight_OnePage_Content_Content').text().length>0)
            {
                $('#ConfirmAnswerRight_OnePage_Message').css('visibility','visible');
                $('#ConfirmAnswerRight_OnePage_Message').css('z-index','19998');
            }
        }
    }
}
$('.ConfirmAnswerRight_OnePage').on('click',function(){
    if (parseFloat($(this).css('opacity'))!=parseFloat(1))  return false;
    var _currentPage='';
    var _curPage=GetCurrentQuestionPage();
    if (typeof _curPage!= typeof undefined)
    {
        _currentPage=_curPage.attr('id');
        // Có thời gian
        if (parseInt($('#'+_currentPage).attr('maxtime'))>0)
        {
            var _leftTime=parseInt($('#'+_currentPage).attr('lefttime'));
            // Còn thời gian
            if (_leftTime>0)
            {
                if (CheckAnswerByQuesIDApart(_currentPage) == true) // Nếu đã trả lời một cái gì đó
                {
                    if (CheckAnswerByQuesID(_currentPage) == true) // Nếu trả lời đúng
                    {
                        ShowMessage('messtrue');
                        _curPage.attr('lefttime','0');
                        $(this).css('opacity','0.6');
                        clearInterval(timeQuestionPageInterval);
                        CheckEndOfGroup(_curPage.attr('groupid'));
                        _curPage.attr('mustanswer','False');
                        RemoveEventAfterConfirm(_curPage.attr('id'));
                    }
                    else
                    {
                        ShowMessage('messfail');
                        _curPage.attr('lefttime','0');
                        $(this).css('opacity','0.6');
                        clearInterval(timeQuestionPageInterval);
                        CheckEndOfGroup(_curPage.attr('groupid'));
                        _curPage.attr('mustanswer','False');
                        RemoveEventAfterConfirm(_curPage.attr('id'));
                    }
                }
                else // Nếu chưa trả lời
                {
                    ShowMessage('messmiss');
                }
            }
            // Hết thời gian
            if (_leftTime<=0)
            {
                if (CheckAnswerByQuesIDApart(_currentPage) == true) // Nếu đã trả lời một cái gì đó
                {
                    if (CheckAnswerByQuesID(_currentPage) == true) // Nếu trả lời đúng
                    {
                        ShowMessage('messtrue');
                        $(this).css('opacity','0.6');
                        clearInterval(timeQuestionPageInterval);
                        CheckEndOfGroup(_curPage.attr('groupid'));
                        _curPage.attr('mustanswer','False');
                        RemoveEventAfterConfirm(_curPage.attr('id'));
                    }
                    else
                    {
                        ShowMessage('messfail');
                        $(this).css('opacity','0.6');
                        clearInterval(timeQuestionPageInterval);
                        CheckEndOfGroup(_curPage.attr('groupid'));
                        _curPage.attr('mustanswer','False');
                        RemoveEventAfterConfirm(_curPage.attr('id'));
                    }
                }
                else // Nếu chưa trả lời
                {
                    ShowMessage('timeout');
                    $(this).css('opacity','0.6');
                    clearInterval(timeQuestionPageInterval);
                    CheckEndOfGroup(_curPage.attr('groupid'));
                        _curPage.attr('mustanswer','False');
                        RemoveEventAfterConfirm(_curPage.attr('id'));
                }
            }
        }
        else // Không có thời gian
        {
            // Phải trả lời
            if (typeof _curPage.attr('mustanswer') != typeof undefined && _curPage.attr('mustanswer') == 'True')
            {
                if (CheckAnswerByQuesIDApart(_currentPage) == true)// Nếu đã trả lời một cái gì đó
                {
                    if (CheckAnswerByQuesID(_currentPage) == true) // Nếu trả lời đúng
                    {
                        ShowMessage('messtrue');
                        clearInterval(timeQuestionPageInterval);
                        $(this).css('opacity','0.6');
                        CheckEndOfGroup(_curPage.attr('groupid'));
                        _curPage.attr('mustanswer','False');
                        RemoveEventAfterConfirm(_curPage.attr('id'));
                    }
                    else
                    {
                        ShowMessage('messfail');
                        clearInterval(timeQuestionPageInterval);
                        $(this).css('opacity','0.6');
                        CheckEndOfGroup(_curPage.attr('groupid'));
                        _curPage.attr('mustanswer','False');
                        RemoveEventAfterConfirm(_curPage.attr('id'));
                    }
                }
                else // Nếu chưa trả lời
                {
                    ShowMessage('messmiss');
                }
            }
            else // Không phải trả lời
            {
                if (CheckAnswerByQuesIDApart(_currentPage) == true)// Nếu đã trả lời một cái gì đó
                {
                    if (CheckAnswerByQuesID(_currentPage) == true) // Nếu trả lời đúng
                    {
                        ShowMessage('messtrue');
                        clearInterval(timeQuestionPageInterval);
                        $(this).css('opacity','0.6');
                        CheckEndOfGroup(_curPage.attr('groupid'));
                        RemoveEventAfterConfirm(_curPage.attr('id'));
                    }
                    else
                    {
                        ShowMessage('messfail');
                        clearInterval(timeQuestionPageInterval);
                        $(this).css('opacity','0.6');
                        CheckEndOfGroup(_curPage.attr('groupid'));
                        RemoveEventAfterConfirm(_curPage.attr('id'));
                    }
                }
                else // Nếu chưa trả lời
                {
                    ShowMessage('messmiss');
                }
            }
        }
        //Restyle khung thông báo
        $('#ConfirmAnswerRight_OnePage_Content_btnAccept').css('line-height',$('#ConfirmAnswerRight_OnePage_Content_btnAccept').height() + 'px');
        $('#ConfirmAnswerRight_OnePage_Content_btnAccept').css('font-size',$('#ConfirmAnswerRight_OnePage_Content_btnAccept').height()*0.5 + 'px');
        $('#ConfirmAnswerRight_OnePage_Content_Content').css('line-height',$('#ConfirmAnswerRight_OnePage_Content_btnAccept').height() + 'px');
        $('#ConfirmAnswerRight_OnePage_Content_Content').css('font-size',$('#ConfirmAnswerRight_OnePage_Content_btnAccept').height()*0.5 + 'px');
        if ($('#ConfirmAnswerRight_OnePage_Content_Content').text().length>10)
            $('#ConfirmAnswerRight_OnePage_Content_Content').css('padding-top',$('#ConfirmAnswerRight_OnePage_Content_btnAccept').height()/3 + 'px');
        else
            $('#ConfirmAnswerRight_OnePage_Content_Content').css('padding-top',$('#ConfirmAnswerRight_OnePage_Content_btnAccept').height()/1.5 + 'px');
    }
});
$('#ConfirmAnswerRight_OnePage_Content_btnAccept').on('click',function(){
    //Kiểm tra câu hỏi trong nhóm đã trả lời hết chưa
    $(this).parent().parent().css('visibility','hidden'); return false;
    var _currentGroup='';var _currentPage='';$('#leftMainContent').children().each(function(){var _style=$(this).attr('style');if (_style.indexOf('visible')>0  && $(this).attr('id').indexOf('QuestionPage')>0){_currentPage=$(this).attr('id');_currentGroup=$(this).attr('questiongroup');return false;}});
    var _checkAnswer=true;$('#leftMainContent').children().each(function(){var _style=$(this).attr('questiongroup');if (_style==_currentGroup){_tempCheck=false;$(this).children().children().children().children('.CELQuestionPage_1_Answers_IMG').each(function(){if ($(this).attr('src').toLowerCase().indexOf('checked.png')>0){_tempCheck=true;return false;}});if (_tempCheck==false){_checkAnswer=false;}}});
    if (_checkAnswer==true){$(this).parent().parent().css('visibility','hidden');$(this).parent().parent().css('z-index','-1');$('#'+_currentPage).children().children().children('.ConfirmAnswerRight_AllPage').trigger('click');}
    else{$(this).parent().parent().css('visibility','hidden');$(this).parent().parent().css('z-index','-1');}
});
function GetCurrentQuestionPage() 
{
    var _curPage;
    var _firstQuesPage;
    $('#leftMainContent').children().each(function(){
        // Trang đang show có class CELPage - không hidden - có questype
        if ($(this).hasClass('CELPage')==true 
            && typeof $(this).attr('questype') != typeof undefined
            && typeof _firstQuesPage==typeof undefined)
            _firstQuesPage=$(this);
        if (typeof _firstQuesPage==typeof undefined)
            return _firstQuesPage;
        if ($(this).hasClass('CELPage')==true
            && typeof $(this).attr('questype') != typeof undefined
            && $(this).hasClass('hidden')==false)
        {
            _curPage=$(this);
            return _curPage;
        }
    });
    return _curPage;
}
function SwapQuestionType(engType){
    if (engType=='Choice') return 'Trắc nghiệm một lựa chọn';
    if (engType=='MultiChoice') return 'Trắc nghiệm nhiều lựa chọn';
    if (engType=='Cloze') return 'Điền khuyết';
    if (engType=='TrueFalse') return 'Đúng sai';
    if (engType=='Underline') return 'Gạch chân';
    if (engType=='CrossLinking') return 'Nối chéo';
}
function HideRowResult_Panel(rowIndex){
    var _curPage=GetCurrentQuestionPage();
    if (typeof _curPage!= typeof undefined)
    {
        var _currentGroup=_curPage.attr('questiongroup');
        $('#QuestionResultPanel_NoScore').css('visibility','visible');
        $('#QuestionResultPanel_NoScore').css('zIndex','19998');
        $('#QuestionResultPanel_NoScore').find('.QuestionResultPanelContent_Top_Right_NoScore').children().css('visibility','visible');
        $('#QuestionResultPanel_NoScore').find('.QuestionResultPanelContent_Top_Left_NoScore').children().css('visibility','visible');
        if (rowIndex==0)// Tính điểm không tính %
        {
            $('#QuestionResultPanel').css('height','70%');
            $('#QuestionResultPanel_NoScore').css('visibility','hidden');
            $('#QuestionResultPanel_NoScore').css('zIndex','-1');
            $('#QuestionResultPanel').css('visibility','visible');
            $('#QuestionResultPanel').css('zIndex','19998');
            $('#QuestionResultPanel').find('.QuestionResultPanelContent_Top_Right').children(':eq(3)').css('visibility','visible');
            $('#QuestionResultPanel').find('.QuestionResultPanelContent_Top_Left').children(':eq(3)').css('visibility','visible');
            $('.QuestionResultPanelContent_Middle_Table').find('tr:gt(0)').remove();
            var _tbl=$('.QuestionResultPanelContent_Middle_Table');
            // Duyệt các câu hỏi thuộc nhóm, đưa vào bảng
            var _tempHTML='';var _num=1; 
            $('#leftMainContent').children().each(function(){
                if ($(this).attr('questiongroup')==_currentGroup){
                    _tempHTML='';_tempHTML+='<tr>';
                    _tempHTML+='<td class="QuesResultRow text-center" style="width:7%">'+_num+'</td>';
                    _tempHTML+='<td class="QuesResultRow" style="width:35%">'+$('#RightMenu'+$(this).attr('id')).text() + '</td>';
                    _tempHTML+='<td class="QuesResultRow text-center" style="width:20%">'+ SwapQuestionType($(this).attr('questype')) +'</td>';
                    if (CheckAnswerByQuesID($(this).attr('id'))==true)
                        _tempHTML+='<td class="QuesResultRow text-center" style="width:15%"> Đúng </td>';
                    else
                        _tempHTML+='<td class="QuesResultRow text-center" style="width:15%"> Sai </td>';
                    _tempHTML+='<td class="QuesResultRow text-center viewQuestionLink" style="width:15%;cursor: pointer;" behindlink="'+$(this).attr('id')+'"> Xem </td>';
                    _tempHTML+='</tr>';
                    _num++;_tbl.append(_tempHTML);
                }
            });
            $('.QuestionResultPanelContent_Middle_Table').find('tr').css('font-size',$('.pageNameLeft').css('font-size'));
            $('.QuestionResultPanelContent_Middle_Table').find('tr').css('line-height',($('.QuestionResultPanelContent_Top_Left').height()/5) + 'px');
        }
        if (rowIndex==1)//Không tính cả điểm và %
        {
            $('#QuestionResultPanel_NoScore').css('visibility','hidden');
            $('#QuestionResultPanel_NoScore').css('zIndex','-1');
            $('#QuestionResultPanel').css('visibility','visible');
            $('#QuestionResultPanel').css('zIndex','19998');
            $('#QuestionResultPanel').find('.QuestionResultPanelContent_Top_Right').children(':eq(3)').text('');
            $('#QuestionResultPanel').find('.QuestionResultPanelContent_Top_Left').children(':eq(3)').text('');
            $('#QuestionResultPanel').find('.QuestionResultPanelContent_Top_Right').children(':eq(3)').css('visibility','hidden');
            $('#QuestionResultPanel').find('.QuestionResultPanelContent_Top_Left').children(':eq(3)').css('visibility','hidden');
            $('#QuestionResultPanel').css('height','63%');
            $('.QuestionResultPanelContent_Middle_Table').find('tr:gt(0)').remove();
            var _tbl=$('.QuestionResultPanelContent_Middle_Table');
            // Duyệt các câu hỏi thuộc nhóm, đưa vào bảng
            var _tempHTML='';var _num=1; 
            $('#leftMainContent').children().each(function(){
                if ($(this).attr('questiongroup')==_currentGroup){
                    _tempHTML='';
                    _tempHTML+='<tr>';
                    _tempHTML+='<td class="QuesResultRow text-center" style="width:7%">'+_num+'</td>';
                        _tempHTML+='<td class="QuesResultRow" style="width:35%">'+$('#RightMenu'+$(this).attr('id')).text() + '</td>';
                    _tempHTML+='<td class="QuesResultRow text-center" style="width:20%">'+ SwapQuestionType($(this).attr('questype')) +'</td>';
                    if (CheckAnswerByQuesID($(this).attr('id'))==true)
                        _tempHTML+='<td class="QuesResultRow text-center" style="width:15%"> Đúng </td>';
                    else
                        _tempHTML+='<td class="QuesResultRow text-center" style="width:15%"> Sai </td>';
                    _tempHTML+='<td class="QuesResultRow text-center viewQuestionLink" style="width:15%;cursor: pointer;" behindlink="'+$(this).attr('id')+'"> Xem </td>';
                    _tempHTML+='</tr>';
                    _num++;_tbl.append(_tempHTML);
                }
            });
            $('.QuestionResultPanelContent_Middle_Table').find('tr').css('font-size',$('.pageNameLeft').css('font-size'));
            $('.QuestionResultPanelContent_Middle_Table').find('tr').css('line-height',($('.QuestionResultPanelContent_Top_Left').height()/5) + 'px');
        }
        if (rowIndex==2)// Tính điểm và tính %
        {
            $('#QuestionResultPanel_NoScore').css('height','37%');
            $('.QuestionResultPanelContent_Middle_NoScore').css('bottom','15%');
            $('.QuestionResultPanelContent_Bottom_NoScore_Left').css('height','11%');
            $('.QuestionResultPanelContent_Bottom_NoScore_Left').css('bottom','3%');
            $('.QuestionResultPanelContent_Bottom_NoScore_Right').css('height','10%');
            $('.QuestionResultPanelContent_Bottom_NoScore_Right').css('bottom','3%');
            $('.QuestionResultPanelContent_NoScore').css('overflow-y','Auto');
        }
        if (rowIndex==3)// Tính % không tính điểm
        {
            $('#QuestionResultPanel_NoScore').css('height','33%');
            $('.QuestionResultPanelContent_Middle_NoScore').css('bottom','18%');
            $('.QuestionResultPanelContent_Bottom_NoScore_Left').css('height','12%');
            $('.QuestionResultPanelContent_Bottom_NoScore_Left').css('bottom','4%');
            $('.QuestionResultPanelContent_Bottom_NoScore_Right').css('height','12%');
            $('.QuestionResultPanelContent_Bottom_NoScore_Right').css('bottom','4%');
            $('#QuestionResultPanel_NoScore').find('.QuestionResultPanelContent_Top_Right_NoScore').children(':eq(3)').text('');
            $('#QuestionResultPanel_NoScore').find('.QuestionResultPanelContent_Top_Left_NoScore').children(':eq(3)').text('');
            $('#QuestionResultPanel_NoScore').find('.QuestionResultPanelContent_Top_Right_NoScore').children(':eq(3)').css('visibility','hidden');
            $('#QuestionResultPanel_NoScore').find('.QuestionResultPanelContent_Top_Left_NoScore').children(':eq(3)').css('visibility','hidden');
        }
        $('#QuestionResultPanel_NoScore').css('left',($('#leftMainContent').width()-$('#QuestionResultPanel_NoScore').width())/2 + 'px');
        $('#QuestionResultPanel_NoScore').css('top',($('#leftMainContent').height()-$('#QuestionResultPanel_NoScore').height())/2 + 'px');
        $('#QuestionResultPanel_NoScore').find('.QuestionResultPanelContent_Top_Right_NoScore').children().each(function(){$(this).css('line-height',$(this).parent().height()/$(this).parent().children().leght) + 'px';$(this).css('font-size',$(this).parent().height()*0.1 + 'px');});
        $('#QuestionResultPanel_NoScore').find('.QuestionResultPanelContent_Top_Left_NoScore').children().each(function(){$(this).css('line-height',$(this).parent().height()/$(this).parent().children().leght) + 'px';$(this).css('font-size',$(this).parent().height()*0.1 + 'px');});
        $('.QuestionResultPanelContent_Middle_NoScore').css('font-size',parseFloat($('#QuestionResultPanel_NoScore').find('.QuestionResultPanelContent_Bottom_NoScore_Left').css('font-size'))*1.2 + 'px' );
        $('.QuestionResultPanelContent_Middle_NoScore').css('line-height',parseFloat($('.QuestionResultPanelContent_Bottom_NoScore_Left').css('line-height')*2) + 'px');
    }
}
function QuestionReviewPanelShow(questionID)
{
    $('#ViewQuestionPanel').css('visibility','visible');
    $('#ViewQuestionPanel').css('z-index','20000');
    $('#ViewQuestionPanel').css('left',($('#leftMainContent').width()-$('#ViewQuestionPanel').width())/2 + 'px' );
    $('#ViewQuestionPanel').css('top',($('#leftMainContent').height()-$('#ViewQuestionPanel').height())/2 + 'px');
    $('.ViewQuestionPanel_Content_Bottom_AnswerList').css('border-top','1px solid #000000');
    $('.ViewQuestionPanel_Content_Bottom_AnswerList').css('overflow-y','Auto');
    var _quesID=$('#'+questionID);
    var _htmlAppend='';
    var _htmlAppendAnswer='';
    var _tempArr=0;
    _htmlAppendQues='';
    var _quesType=_quesID.attr('questype').toLowerCase();
    if (_quesType=='choice' || _quesType=='multichoice'){
        _quesID.children().each(function(){
            if ($(this).attr('id').indexOf('QuestionContent')>-1){
                _htmlAppend=$(this).clone();
                _htmlAppendQues+='<div style="border:1px solid #000000; width: 96.5%; padding-left:2px; padding-right: 2px; margin-top: 2px; margin-bottom: 2px; margin-left: 0.5%; overflow-y: auto; display: block;">';
                if (typeof _htmlAppend.attr('id')!=typeof undefined){
                    _htmlAppend.attr('id',_htmlAppend.attr('id')+'_Clone');
                    _htmlAppend.children().each(function(){if (typeof $(this).attr('id') != typeof undefined) $(this).attr('id',$(this).attr('id')+'_Clone');});
                    _htmlAppend.children().children().each(function(){if (typeof $(this).attr('id') != typeof undefined) $(this).attr('id',$(this).attr('id')+'_Clone');});
                    _htmlAppend.children().children().children().each(function(){if (typeof $(this).attr('id') != typeof undefined) $(this).attr('id',$(this).attr('id')+'_Clone');});
                    _htmlAppend.children().remove('svg');
                    _htmlAppend.children().css('position','');
                    _htmlAppend.children().css('line-height','1');
                }
                _htmlAppendQues+=_htmlAppend.html() + '</div>';
            }
            if ($(this).attr('id').indexOf('AnswerContent')>-1){
                if (_tempArr%2==0) _htmlAppendAnswer+='<div class="MultiChoiceAnswerReview">';
                _tempArr++;
                _htmlAppendAnswer+='<div class="MultiChoiceAnswerReview_ILBlock">';
                _htmlAppendAnswer+='<div class="MultiChoiceAnswerReview_ILBlock_Right">';
                var _img=$(this).children(':eq(1)').children(':eq(0)').children('.CELQuestionPage_1_Answers_IMG').attr('src').toLowerCase();
                if (_img.indexOf('checked.png')>0){
                    if (_quesType=='multichoice') 
                        _htmlAppendAnswer+='<img src="images/button/Question/MultiChoiceChecked.png">'; 
                    else
                        _htmlAppendAnswer+='<img src="images/button/Question/checked.png">';
                    _htmlAppendAnswer+='</div>';
                    if (CheckAnswer($(this).attr('id'))==true)
                        _htmlAppendAnswer+='<div class="MultiChoiceAnswerReview_ILBlock_Left" style="border: 1px solid green; overflow-y: auto; word-wrap: break-word;" >' + $(this).children().first().clone().html() + '</div>';  
                    else
                        _htmlAppendAnswer+='<div class="MultiChoiceAnswerReview_ILBlock_Left" style="border: 1px solid red; overflow-y: auto; word-wrap: break-word;" >' + $(this).children().first().clone().html() + '</div>';
                }else{
                    if (_quesType=='multichoice')
                        _htmlAppendAnswer+='<img src="images/button/Question/MultiChoice.png">';
                    else
                        _htmlAppendAnswer+='<img src="images/button/Question/normal.png">';
                    _htmlAppendAnswer+='</div>';
                    if (CheckAnswer($(this).attr('id'))==true) 
                        _htmlAppendAnswer+='<div class="MultiChoiceAnswerReview_ILBlock_Left" style="border: 1px solid orange; overflow-y: auto; word-wrap: break-word;" >' + $(this).children().first().clone().html() + '</div>'; 
                    else
                        _htmlAppendAnswer+='<div class="MultiChoiceAnswerReview_ILBlock_Left" style="border: 1px solid red; overflow-y: auto; word-wrap: break-word;" >' + $(this).children().first().clone().html() + '</div>';
                }
                _htmlAppendAnswer+='</div>';
                if (_tempArr%2==0) _htmlAppendAnswer+='</div>';
            }
        });
    }
    if (_quesType=='crosslinking'){
        _quesID.children().each(function(){
            if ($(this).attr('id').indexOf('QuestionContent')>-1){
                _htmlAppend=$(this).clone();
                _htmlAppendQues+='<div style="border:1px solid #000000; width: 96.5%;padding-left:2px; padding-right: 2px; margin-top: 2px; margin-bottom: 2px; margin-left: 0.5%; overflow-y: auto; display: block;">';
                _htmlAppend.children().remove('svg');
                _htmlAppend.children().css('position','');
                _htmlAppend.children().css('line-height','1');
                if (typeof _htmlAppend.attr('id')!=typeof undefined){
                    _htmlAppend.attr('id',_htmlAppend.attr('id')+'_Clone');
                    _htmlAppend.children().each(function(){if (typeof $(this).attr('id') != typeof undefined) $(this).attr('id',$(this).attr('id')+'_Clone');});
                    _htmlAppend.children().children().each(function(){if (typeof $(this).attr('id') != typeof undefined) $(this).attr('id',$(this).attr('id')+'_Clone');});
                    _htmlAppend.children().children().children().each(function(){if (typeof $(this).attr('id') != typeof undefined) $(this).attr('id',$(this).attr('id')+'_Clone');});
                }
                _htmlAppendAnswer=CrossLinkAnswerReview(_quesID.attr('id'));
                _htmlAppendQues+=_htmlAppend.html() + '</div>';
            }
        });
    }
    var tempClozeQues;
    if (_quesType=='cloze'){
        _quesID.children().each(function(){
            if ($(this).attr('id').indexOf('QuestionContent')>-1)
            {
                _htmlAppendQues+="<div style='border:1px solid #000000; width: 96.5%;padding-left:2px; padding-top: 4px; padding-right: 2px; margin-top: 4px; margin-bottom: 4px; margin-left: 0.5%; overflow-y: auto; display: block;'></div>";
                tempClozeQues=CloneStyleClozeQuestions($(this).attr('id'));
                _htmlAppendAnswer=ClozeAnswerListQuestionView($(this).attr('id'));
            }
        });
    }
    if (_quesType=='truefalse')
    {
        _htmlAppendQues=TrueFalseQuesReviewQues(questionID);
        _htmlAppendAnswer=TrueFalseQuesReviewAnswer(questionID);
    }
    if (_quesType=='underline') _htmlAppendQues=UnderLineReviewQues(questionID);
    if ( typeof $('.ViewQuestionPanel_Content_Top').children('.jspContainer').attr('class') == typeof undefined){
        $('.ViewQuestionPanel_Content_Top').empty();
        $('.ViewQuestionPanel_Content_Top').append(_htmlAppendQues);
        if (typeof tempClozeQues!=typeof undefined) tempClozeQues.appendTo($('.ViewQuestionPanel_Content_Top').children());
    }else{
        $('.ViewQuestionPanel_Content_Top').children('.jspContainer').children('.jspPane').empty();
        $('.ViewQuestionPanel_Content_Top').children('.jspContainer').children('.jspPane').append(_htmlAppendQues);
        if (typeof tempClozeQues!=typeof undefined) tempClozeQues.appendTo($('.ViewQuestionPanel_Content_Top').children('.jspContainer').children('.jspPane').children());
    }
    var _allHeigh=0;var _itemsCount=0;
    $('.ViewQuestionPanel_Content_Top').children().children('.jspPane').children().each(function(){_allHeigh += ($(this).height()+4);_itemsCount++;});
    var _viewHeigh=$('.ViewQuestionPanel_Content_Top').height();
    if (parseInt(_allHeigh)<parseInt(_viewHeigh)){
        if (_itemsCount>1) $('.ViewQuestionPanel_Content_Top').children().children('.jspPane').children().each(function(){$(this).css('height',($('.ViewQuestionPanel_Content_Top').height()/_itemsCount)-4);});
        else $('.ViewQuestionPanel_Content_Top').children().children('.jspPane').children().each(function(){$(this).css('height',($('.ViewQuestionPanel_Content_Top').height()/2)-4);});
    }
    $('.ViewQuestionPanel_Content_Top').children().children('.jspPane').children().each(function(){if ($(this).height()<$(this).children().first().height())$(this).css('height','auto');});
    if ( typeof $('.ViewQuestionPanel_Content_Bottom_AnswerList').children('.jspContainer').attr('class') == typeof undefined){
        $('.ViewQuestionPanel_Content_Bottom_AnswerList').empty();
        if (_htmlAppendAnswer.trim()!=''){$('.ViewQuestionPanel_Content_Bottom_AnswerList').append(_htmlAppendAnswer);$('.ViewQuestionPanel_Content_Bottom_AnswerList').css('border-top','1px solid #D0D0D0');}else $('.ViewQuestionPanel_Content_Bottom_AnswerList').css('border-top','none');
    }else{
        $('.ViewQuestionPanel_Content_Bottom_AnswerList').children('.jspContainer').children('.jspPane').empty();
        if (_htmlAppendAnswer.trim()!=''){$('.ViewQuestionPanel_Content_Bottom_AnswerList').children('.jspContainer').children('.jspPane').append(_htmlAppendAnswer);$('.ViewQuestionPanel_Content_Bottom_AnswerList').css('border-top','1px solid #D0D0D0');}else $('.ViewQuestionPanel_Content_Bottom_AnswerList').css('border-top','none');
    }
    // Câu điền khuyết
    $('.ClozeAnswerView').css('height',$('.ViewQuestionPanel_Content_Bottom_AnswerList').height()*0.425 + 'px');
    $('.MultiChoiceAnswerReview').css('height',$('.ViewQuestionPanel_Content_Bottom_AnswerList').height()*0.425 + 'px');
    $('.MultiChoiceAnswerReview_ILBlock_Right >img').css('max-width',$('.MultiChoiceAnswerReview_ILBlock_Right').width()*0.4 + 'px');
    $('.MultiChoiceAnswerReview_ILBlock_Right >img').css('margin-left',$('.MultiChoiceAnswerReview_ILBlock_Right').width()*0.3 + 'px');
    $('.MultiChoiceAnswerReview_ILBlock_Right >img').css('margin-top',($('.MultiChoiceAnswerReview_ILBlock_Right').height()-$('.MultiChoiceAnswerReview_ILBlock_Right >img').height())/2 + 'px');
    // Câu nối chéo
    if (typeof CrossLinkReivewInit !== 'undefined' && $.isFunction(CrossLinkReivewInit)) CrossLinkReivewInit();
}
function RestyleQuesOneChoice(){
    $('.CELQuestionPage_1_Label').each(function(){
        if ($(this).children('.CELQuestionPage_1_Answers_IMG').attr('src').indexOf('MultiChoice')>0){
            $(this).children('.CELQuestionPage_1_Answers_IMG').css('max-height',$(this).parent().parent().parent().width()*0.02 + 'px');
            $(this).children('.CELQuestionPage_1_Answers_IMG').css('left',$(this).parent().parent().parent().width()*0.015 + 'px');
            $(this).children('.CELQuestionPage_1_Answers_IMG').css('top',$(this).parent().parent().height()/2 - $(this).children('.CELQuestionPage_1_Answers_IMG').width()/2 + 'px');
        }else{
            $(this).children('.CELQuestionPage_1_Answers_IMG').css('max-height',$(this).parent().parent().parent().width()*0.025 + 'px');
            $(this).children('.CELQuestionPage_1_Answers_IMG').css('left',$(this).parent().parent().parent().width()*0.01 + 'px');
            $(this).children('.CELQuestionPage_1_Answers_IMG').css('top',$(this).parent().parent().height()/2 - $(this).children('.CELQuestionPage_1_Answers_IMG').width()/2 + 'px');
        }
    });
    $('.ConfirmAnswerLeft_Middle_Time_Right_Number').each(function(){$(this).css('line-height',$(this).parent().height()+'px');$(this).css('font-size',$(this).parent().height()*0.45+'px');});
    $('.ConfirmAnswerLeft_Middle_Score_Right_Number').each(function(){$(this).css('line-height',$(this).parent().height()+'px');$(this).css('font-size',$(this).parent().height()*0.45+'px');});
    $('.ConfirmAnswerLeft_Middle_Score_Right_Number').each(function(){$(this).css('line-height',$(this).parent().height()+'px');$(this).css('font-size',$(this).parent().height()*0.45+'px');});
    $('.ConfirmAnswerLeft_Middle_Score_Left').each(function(){$(this).css('line-height',$(this).parent().parent().parent().height() + 'px');$(this).css('font-size',$(this).parent().parent().parent().height()*0.35+'px');});
    $('.ConfirmAnswerLeft_Middle_Time_Left').each(function(){$(this).css('line-height',$(this).parent().parent().parent().height() + 'px');$(this).css('font-size',$(this).parent().parent().parent().height()*0.35+'px');});
    $('.ConfirmAnswerLeft_Right_ShowResult_Content').each(function(){$(this).css('line-height', $(this).parent().height() + 'px');$(this).css('font-size', $(this).parent().height()*0.35 + 'px')});
    $('.ConfirmAnswerRight_Content').each(function(){$(this).css('line-height',$(this).parent().height()+'px');$(this).css('font-size',$(this).parent().height()*0.5+'px');});
    $('.QuestionResultPanelHeader_Content').each(function(){$(this).css('line-height',$(this).parent().height() + 'px');$(this).css('font-size',$(this).parent().height()*0.45 + 'px');});
    $('.QuestionResultPanelContent_Top_Text').each(function(){$(this).css('font-size',$('.pageNameLeft').css('font-size'));$(this).css('line-height',($(this).parent().height()/5) + 'px');});
    $('.QuestionResultPanelContent_Bottom').each(function(){$(this).css('font-size',$(this).parent().children().first().children().first().children().first().css('font-size'));$(this).css('line-height',$(this).height()+'px');});
    $('.QuestionResultPanelContent_Top_Right > p').each(function(){$(this).css('font-weight','bold');});
    $('.QuestionResultPanelContent_Bottom_NoScore_Left').each(function(){$(this).css('font-size',$(this).height()*0.55 + 'px');$(this).css('line-height',$(this).height()+'px');});
    $('.QuestionResultPanelContent_Bottom_NoScore_Right').each(function(){$(this).css('font-size',$(this).height()*0.55 + 'px');$(this).css('line-height',$(this).height()+'px');});
    $('.QuestionResultPanelContent_Middle_NoScore').each(function(){$(this).css('font-size',$(this).height()*0.55 + 'px');$(this).css('line-height',$(this).height()+'px');});
    $('.ConfirmAnswerLeft_Left_btnNext').children().each(function(){$(this).css('height',$(this).parent().height()+'px'); $(this).css('width',$(this).parent().height()+'px'); });
    $('.ConfirmAnswerLeft_Left_btnPre').children().each(function(){ $(this).css('height',$(this).parent().height()+'px');$(this).css('width',$(this).parent().height()+'px');});
    $('#leftMainContent').children().each(function(){if (typeof $(this).attr('id')!= typeof undefined && $(this).attr('id').indexOf('QuestionPage_')>0){_curPage=$(this);if (typeof _curPage.attr('score')!=typeof undefined) _curPage.children().children('.ConfirmAnswerLeft').children('.ConfirmAnswerLeft_Middle').children('.ConfirmAnswerLeft_Middle_Score').children('.ConfirmAnswerLeft_Middle_Score_Right').children().text(_curPage.attr('score'));if (typeof _curPage.attr('lefttime')!=typeof undefined){ var _timeContent=(new Date).clearTime().addSeconds(parseInt(_curPage.attr('lefttime'))).toString('mm:ss'); _curPage.children().children('.ConfirmAnswerLeft').children('.ConfirmAnswerLeft_Middle').children('.ConfirmAnswerLeft_Middle_Time').children('.ConfirmAnswerLeft_Middle_Time_Right').children().text(_timeContent); }else{_timeContent=(new Date).clearTime().addSeconds(parseInt(_curPage.attr('maxtime'))).toString('mm:ss'); _curPage.children().children('.ConfirmAnswerLeft').children('.ConfirmAnswerLeft_Middle').children('.ConfirmAnswerLeft_Middle_Time').children('.ConfirmAnswerLeft_Middle_Time_Right').children().text(_timeContent); }}});
};
// Ẩn hiện nút lùi và tiến trang câu hỏi
function NextPreviewButtonQuestionPage(){
    // Tìm trang câu hỏi hiện tại
    var _curPage=GetCurrentQuestionPage();
    if (typeof _curPage!=typeof undefined)
    {
        var _currentPage=_curPage.index();
        if (typeof _curPage.attr('score')!=typeof undefined) _curPage.find('.ConfirmAnswerLeft_Middle_Score_Right').children().text(_curPage.attr('score'));
        if (typeof _curPage.attr('lefttime')!=typeof undefined){
            var _timeContent=(new Date).clearTime().addSeconds(parseInt(_curPage.attr('lefttime'))).toString('mm:ss');
            _curPage.find('.ConfirmAnswerLeft_Middle_Time_Right').children().text(_timeContent);
        }else
            if (typeof _curPage.attr('maxtime')!=typeof undefined)
            {
                var _timeContent=(new Date).clearTime().addSeconds(parseInt(_curPage.attr('maxtime'))).toString('mm:ss');
                _curPage.find('.ConfirmAnswerLeft_Middle_Time_Right').children().text(_timeContent);
            }
        //Tìm trang câu hỏi cuối cùng và đầu tiên trong cùng group
        if ($('#leftMainContent').children(':eq('+ _currentPage + ')').attr('id').indexOf('QuestionPage')>=0)
        {
            var _lastQuesPage=-1;
            var _firstQuesPage=-1;
            $('#leftMainContent').children().each(function(){
                var _style=$(this).attr('id');
                if (typeof _style!= typeof undefined 
                    && parseInt(_style.indexOf('CELQuestionPage'))>-1
                    && _firstQuesPage<0 
                    && typeof _curPage.attr('questiongroup') != typeof undefined 
                    && typeof _curPage.attr('questiongroup') != false 
                    && typeof $(this).attr('questiongroup')!= typeof undefined 
                    && typeof $(this).attr('questiongroup') != false 
                    && $(this).attr('questiongroup')==_curPage.attr('questiongroup'))
                    _firstQuesPage=$(this).index();
                if (typeof _style!= typeof undefined 
                    && parseInt(_style.indexOf('CELQuestion'))>-1 
                    && typeof _curPage.attr('questiongroup') != typeof undefined 
                    && typeof _curPage.attr('questiongroup') != false 
                    && typeof $(this).attr('questiongroup')!= typeof undefined 
                    && typeof $(this).attr('questiongroup') != false 
                    && $(this).attr('questiongroup')==_curPage.attr('questiongroup'))
                    _lastQuesPage=$(this).index();
            });
            //Nếu trang hiện tại ở giữa, hiện cả 2 nút next và previous
            if (_lastQuesPage<0 && _firstQuesPage<0){
                _curPage.find('.ConfirmAnswerLeft_Left_btnNext').children().first().attr('src','images/btnNextQues.png');
                _curPage.find('.ConfirmAnswerLeft_Left_btnPre').children().first().attr('src','images/btnPreviousQues.png');
            }else
                if (_currentPage<_lastQuesPage && _currentPage>_firstQuesPage){
                    _curPage.find('.ConfirmAnswerLeft_Left_btnNext').children().first().attr('src','images/btnNextQuesActive.png');
                    _curPage.find('.ConfirmAnswerLeft_Left_btnPre').children().first().attr('src','images/btnPreviousQuesActive.png');
                }else 
                    if (_currentPage==_firstQuesPage){
                        _curPage.find('.ConfirmAnswerLeft_Left_btnNext').children().first().attr('src','images/btnNextQuesActive.png');
                        _curPage.find('.ConfirmAnswerLeft_Left_btnPre').children().first().attr('src','images/btnPreviousQues.png');
                    }else 
                        if (_currentPage==_lastQuesPage)
                        {
                            _curPage.find('.ConfirmAnswerLeft_Left_btnNext').children().first().attr('src','images/btnNextQues.png');
                            _curPage.find('.ConfirmAnswerLeft_Left_btnPre').children().first().attr('src','images/btnPreviousQuesActive.png');
                        }
            if (_lastQuesPage==_firstQuesPage)
            {
                _curPage.find('.ConfirmAnswerLeft_Left_btnNext').children().first().attr('src','images/btnNextQues.png');
                _curPage.find('.ConfirmAnswerLeft_Left_btnPre').children().first().attr('src','images/btnPreviousQues.png');
            }
            if (typeof InitDragableAnswer !== 'undefined' && $.isFunction(InitDragableAnswer)) InitDragableAnswer();
        }
    }
}
$('.QuestionResultPanelContent_Middle_Table').on('click','td',function(){if (typeof $(this).attr('behindlink') != typeof undefined) QuestionReviewPanelShow($(this).attr('behindlink'));});
$('.QuestionResultPanelContent_Bottom_NoScore_Left').on('click',function(){
    $('.QuestionResultPanelContent_Middle_Table').find('tr:gt(0)').remove();
    var _tbl=$('.QuestionResultPanelContent_Middle_Table');
    var _score=0;
    var _percent=0;
    // Tìm nhóm câu hỏi của trang hiện tại
    var _currentGroup='';
    var _curPage=GetCurrentQuestionPage();
    if (typeof _curPage!=typeof undefined)
    {
        _currentGroup=_curPage.attr('questiongroup');
        $('#leftMainContent').children().each(function(){
            var _style=$(this);
            if (_style.hasClass('CELPage')
                && $(this).attr('id').indexOf('QuestionPage')>0
                && typeof $(this).attr('questiongroup')!=typeof undefined
                && $(this).attr('questiongroup')==_currentGroup)
            {
                if (parseInt($(this).attr('score'))>0) _score+=parseInt($(this).attr('passpercent'));
                if (parseInt($(this).attr('passpercent'))>0) _percent+=parseInt($(this).attr('passpercent'));
                return false;
            }
        });
        // Duyệt các câu hỏi thuộc nhóm, đưa vào bảng
        var _tempHTML='';var _num=1;
        $('#leftMainContent').children().each(function(){
            if ($(this).attr('questiongroup')==_currentGroup){
                _tempHTML='';
                _tempHTML+='<tr>';
                _tempHTML+='<td class="QuesResultRow text-center" style="width:5%">'+_num+'</td>';
                _tempHTML+='<td class="QuesResultRow" style="width:37%">'+$('#RightMenu'+$(this).attr('id')).text() + '</td>';
                _tempHTML+='<td class="QuesResultRow text-center" style="width:30%">'+ SwapQuestionType($(this).attr('questype')) +'</td>';
                if (CheckAnswerByQuesID($(this).attr('id'))==true)
                    _tempHTML+='<td class="QuesResultRow text-center" style="width:8%"> Đúng </td>';
                else
                    _tempHTML+='<td class="QuesResultRow text-center" style="width:8%"> Sai </td>';
                _tempHTML+='<td class="QuesResultRow text-center viewQuestionLink" style="width:20%; cursor: pointer;" behindlink="'+$(this).attr('id')+'"> Xem </td>';
                _tempHTML+='</tr>';
                _num++;_tbl.append(_tempHTML);
            }
        });
        if (_score>0 && _percent > 0){
            $('#ListQuestionPanel_NoScore').css('z-index','19999');
            $('#ListQuestionPanel_NoScore').css('visibility','visible');
        }else{
            $('#QuestionResultPanel').css('z-index','19999');
            $('#QuestionResultPanel').css('visibility','visible');
        }
        $('.QuestionResultPanelContent_Middle_Table').find('tr').css('font-size',$('.pageNameLeft').css('font-size'));
        $('.QuestionResultPanelContent_Middle_Table').find('tr').css('line-height',($('.QuestionResultPanelContent_Top_Left').height()/5) + 'px');
    }
});
$('.CELQuestionPage_1_Answers_Chk').on('click',function(){
    // Tìm trang câu hỏi hiện tại
    var _curPage=GetCurrentQuestionPage();
    if (typeof _curPage!=typeof undefined)
    {
        var _currentPage=_curPage.attr('id');
        if (typeof $('#'+_currentPage).attr('timeouted')!=typeof undefined) return false;
        if (answeredQues.indexOf(_currentPage)<0){
            if ($('#'+_currentPage).attr('questype').toLowerCase()=='choice'){
                $('#'+_currentPage).children().children().children().children('.CELQuestionPage_1_Answers_Chk').checked=false;this.checked=true;$('#'+_currentPage).children().children().children().children('.CELQuestionPage_1_Answers_IMG').attr('src', 'images/button/Question/normal.png');$(this).parent().children('.CELQuestionPage_1_Answers_IMG').attr('src','images/button/Question/checked.png');
            }
            if ($('#'+_currentPage).attr('questype').toLowerCase()=='multichoice'){
                if ($(this).parent().children('.CELQuestionPage_1_Answers_IMG').attr('src').indexOf('MultiChoice.png')>-1) $(this).parent().children('.CELQuestionPage_1_Answers_IMG').attr('src','images/button/Question/MultiChoiceChecked.png'); else $(this).parent().children('.CELQuestionPage_1_Answers_IMG').attr('src','images/button/Question/MultiChoice.png');
            }
        }else{
            $('#ConfirmAnswerRight_OnePage_Content_IMG').attr('src','images/button/Question/messageWarning.png');
            $('#ConfirmAnswerRight_OnePage_Content_Content').text('Câu hỏi này bạn đã trả lời rồi');
            $('#ConfirmAnswerRight_OnePage_Message').css('visibility','visible');
            $('#ConfirmAnswerRight_OnePage_Message').css('z-index','19998');
            $('#ConfirmAnswerRight_OnePage_Content_Content').css('line-height',$('#ConfirmAnswerRight_OnePage_Content_btnAccept').height() + 'px');
            $('#ConfirmAnswerRight_OnePage_Content_Content').css('font-size',$('#ConfirmAnswerRight_OnePage_Content_btnAccept').height()*0.5 + 'px');
            $('#ConfirmAnswerRight_OnePage_Content_Content').css('padding-top',$('#ConfirmAnswerRight_OnePage_Content_btnAccept').height()/1.5 + 'px');
        }
    }
});
//Nút Next bên trái dưới trên trang câu hỏi
$('.ConfirmAnswerLeft_Left_btnNext').on('click',function(){
    // Tìm trang câu hỏi hiện tại
    if (CheckMustAnswerQuestion()==true)
    {
        var _currentPage=GetCurrentQuestionPage();
        if (typeof _currentPage!=typeof undefined)
        {
            var _nextPageInGroup;
            $('#leftMainContent').children().each(function(){
                if ($(this).index()>_currentPage.index()){
                    var _quesGroup=_currentPage.attr('questiongroup');
                    if (typeof _quesGroup != typeof undefined 
                        && typeof _quesGroup != false 
                        && _quesGroup==$(this).attr('questiongroup'))
                    {
                        _nextPageInGroup=$(this);
                        return false;
                    }
                }
            });
            //Nếu tìm được trang câu hỏi tiếp theo cùng group
            if (typeof _nextPageInGroup != typeof undefined && typeof _nextPageInGroup != false)
            {
                $('#leftMainContent').children('.CELPage').css('visibility','');$('#leftMainContent').children('.CELPage').addClass('hidden');
                clickShowPage(_nextPageInGroup.attr('id'));
            }
            if (typeof NextPreviewButtonQuestionPage !== 'undefined' && $.isFunction(NextPreviewButtonQuestionPage)) NextPreviewButtonQuestionPage();
        }
        else
        {
            ShowMessMustAnswer();
        }
    }
});
//Nút Previous bên trái dưới trên trang câu hỏi
$('.ConfirmAnswerLeft_Left_btnPre').on('click',function(){
    // Tìm trang câu hỏi hiện tại
    if (CheckMustAnswerQuestion()==true)
    {
        var _currentPage=GetCurrentQuestionPage();
        if (typeof _currentPage!=typeof undefined)
        {
            //Tìm trang câu hỏi cùng group
            var _prePageInGroup;
            $('#leftMainContent').children().each(function(){
                if ($(this).index()<_currentPage.index())
                {
                    var _quesGroup=_currentPage.attr('questiongroup');
                    if (typeof _quesGroup != typeof undefined 
                        && typeof _quesGroup != false 
                        && _quesGroup==$(this).attr('questiongroup'))
                        _prePageInGroup=$(this);
                }
            });
            //Nếu tìm được trang câu hỏi liền trước cùng group
            if (typeof _prePageInGroup != typeof undefined && typeof _prePageInGroup != false)
            {
                $('#leftMainContent').children('.CELPage').css('visibility','');$('#leftMainContent').children('.CELPage').addClass('hidden');
                clickShowPage(_prePageInGroup.attr('id'));
            }
            if (typeof NextPreviewButtonQuestionPage !== 'undefined' && $.isFunction(NextPreviewButtonQuestionPage)) NextPreviewButtonQuestionPage();
        }
        else
        {
            ShowMessMustAnswer();
        }
    }
});
$('.QuestionResultPanelHeader_btnClose').on('click',function(){    $(this).parent().parent().css('visibility','hidden');    $(this).parent().parent().css('z-index','-1');});
function InitDragableAnswer(){
    // Hủy bỏ toàn bộ draggable và dropable toàn trang
    $('#leftMainContent').children().children().each(function(){
        if (typeof $(this).attr('class')!= typeof undefined && $(this).attr('class').indexOf('ui-draggable') >=0 )
            $(this).removeClass( 'ui-draggable');
        if (typeof $(this).attr('class')!= typeof undefined &&  $(this).attr('class').indexOf('ui-droppable') >=0 )
            $(this).removeClass('ui-droppable');
    });
    var _currentPage=GetCurrentQuestionPage();
    if (typeof _currentPage!=typeof undefined)
    {
        // Hủy drag nếu câu đã xác nhận
        var _onePageOpac=parseFloat(_currentPage.children().children('.ConfirmAnswerRight').children('.ConfirmAnswerRight_OnePage').css('opacity'));
        var _allPageOpac=parseFloat(_currentPage.children().children('.ConfirmAnswerRight').children('.ConfirmAnswerRight_AllPage').css('opacity'));
        if (_allPageOpac < 1 || _onePageOpac<1) 
        {
            if (typeof _currentPage.attr('questype')!=typeof undefined)
            {
                _currentPage.children().each(function(){
                    if (typeof $(this).attr('class')!= typeof undefined && $(this).attr('class').indexOf('ui-draggable-handle') >=0 )
                        $(this).draggable('disable');
                });
            }
            return false;
        }
        //Câu nối chéo
        _currentPage.children().each(function(){
            if (typeof $(this).attr('class')!= typeof undefined && $(this).attr('class').indexOf('DragableAnswer')>=0 && typeof $(this).attr('matching')!= typeof undefined)
            {
                 $(this).draggable({
                    start : function(event,ui)
                    {
                        $(this).css('z-index','1000');
                        if (typeof $(this).attr('clozeid') == typeof undefined) $(this).attr('beginLeft',parseFloat($(this).css('left')));$(this).attr('beginTop',parseFloat($(this).css('top')));
                    }
                },{
                    stop: function( event, ui )
                    {
                        $(this).attr('style',$(this).attr('style').replace('z-index: 1000;',''));
                        if (typeof $(this).attr('matching')!=typeof undefined) CrossLinkPare($(this));
                    }
                },{
                    drag: function(event,ui)
                    {
                        if (isNaN(parseFloat($(this).attr('beginLeft')))) $(this).attr('beginLeft',parseFloat($(this).css('left')));
                        if (isNaN(parseFloat($(this).attr('beginTop')))) $(this).attr('beginTop',parseFloat($(this).css('top')));
                    }
                },{
                    revert : function(event, ui) {}
                });
            }
            else if (typeof $(this).attr('class')!= typeof undefined && $(this).attr('class').indexOf('DragableAnswer')>=0 && typeof $(this).attr('clozeid')!= typeof undefined)
            {
                $(this).draggable({
                    helper:function(event)
                    {
                        return $('<div style="cursor: pointer; display: inline-block;border-radius:5px; border:1px solid black; width:10px; height:10px;"></div>');
                    },
                    cursorAt: { top: 5, left: 5 }
                });
            }
        });
        // Câu điền khuyết
        // Phần câu trả lời - Draggale - Non Dropable
        _currentPage.children().children().children().each(function(){
            if (typeof $(this).attr('clozeid') != typeof undefined){
                $(this).draggable({
                    start: function( event, ui ) { if (typeof $(this).attr('holderanswerid')==typeof undefined) return !event; },
                    helper:function(event){ return $('<div style="cursor: pointer; display: inline-block;border-radius:5px; border:1px solid black; width:10px; height:10px;"></div>');},
                    cursorAt: { top: 5, left: 5 }
                });
            }
        });
        // Phần câu hỏi - Draggable - Dropable - Switchable
        _currentPage.children().children().children().children().each(function(){
            if (typeof $(this).attr('clozeid') != typeof undefined){
                $(this).draggable({
                    start: function( event, ui ) { if (typeof $(this).attr('holderanswerid')==typeof undefined) return !event; },
                    helper:function(event){ return $('<div style="cursor: pointer; display: inline-block;border-radius:5px; border:1px solid black; width:10px; height:10px;"></div>');},
                    cursorAt: { top: 5, left: 5 }
                });
                $(this).droppable({
                    tolerance: 'pointer',
                    drop: function( event, ui ) {
                        if (typeof $(this).attr('holderAnswerID')!= typeof undefined)
                        {
                            var _nextHolderID='';
                            if (typeof ui.draggable.attr('holderAnswerID')!=typeof undefined)
                            {
                                // 2 vị trí đổi chỗ cho nhau
                                _nextHolderID = ui.draggable.attr('holderAnswerID');
                                $(this).text(GetTextOfQuesAns(_nextHolderID)); 
                                ui.draggable.attr('holderAnswerID',$(this).attr('holderAnswerID'));
                                ui.draggable.text(GetTextOfQuesAns($(this).attr('holderAnswerID')));
                                $(this).attr('holderAnswerID',_nextHolderID);
                            }else{
                                $('#'+$(this).attr('holderAnswerID')).css('visibility','visible');
                                $(this).attr('holderAnswerID',ui.draggable.attr('id'));
                                $('#'+ui.draggable.attr('id')).css('visibility','hidden');
                                $(this).text(GetTextOfQuesAns(ui.draggable.attr('id')));
                            }
                        }else{
                            // Điền vào lần đầu
                            $(this).attr('blanktext',$(this).text());
                            $(this).attr('blanktext1',$(this).text());
                            $(this).text(GetTextOfQuesAns(ui.draggable.attr('id')));
                            $(this).attr('holderAnswerID',ui.draggable.attr('id'));
                            $('#'+ui.draggable.attr('id')).css('visibility','hidden');
                        }
                    }
                });
            }
        });
    }
}
function InitQuestionPages(){
    //Color of result box
    $('#QuestionResultPanel').css('background-color',$('#mainRightTop').css('background-color'));    
    $('.QuestionResultPanelHeader').css('background-color',$('#mainRightTop').css('background-color'));
    $('.QuestionResultPanelHeader_Content').css('color',$('#mainTittleContent').css('color'));
    $('.QuestionResultPanelContent').css('background-color',$('.jspPane').css('background-color'));
    $('.QuestionResultPanelContent_Bottom').css('background-color',$('.ConfirmAnswerRight_OnePage').css('background-color'));
    $('.QuestionResultPanelContent_NoScore').css('background-color',$('.jspPane').css('background-color'));
    $('.QuestionResultPanelContent_Bottom_NoScore_Left').css('background-color',$('.ConfirmAnswerRight_OnePage').css('background-color'));
    $('.QuestionResultPanelContent_Bottom_NoScore_Right').css('background-color',$('.ConfirmAnswerRight_OnePage').css('background-color'));    
    // Color of view question box
    $('#ViewQuestionPanel').css('background-color',$('#mainRightTop').css('background-color'));
    $('.ViewQuestionPanel_Header').css('background-color',$('#mainRightTop').css('background-color'));
    $('#ViewQuestionPanel_NoScore').css('background-color',$('#mainRightTop').css('background-color'));
    $('#ListQuestionPanel_NoScore').css('background-color',$('#mainRightTop').css('background-color'));
    $('#QuestionResultPanel_NoScore').css('background-color',$('#mainRightTop').css('background-color'));
    //Restyle khung thông báo
    $('#ConfirmAnswerRight_OnePage_Message').css('background-color',$('#mainRightTop').css('background-color'));
    $('#ConfirmAnswerRight_OnePage_Message_Header').css('background-color',$('#mainRightTop').css('background-color'));
    $('#ConfirmAnswerRight_OnePage_Content_btnAccept').css('line-height',$('#ConfirmAnswerRight_OnePage_Content_btnAccept').height() + 'px');
    $('#ConfirmAnswerRight_OnePage_Content_btnAccept').css('font-size',$('#ConfirmAnswerRight_OnePage_Content_btnAccept').height()*0.5 + 'px');
    $('#ConfirmAnswerRight_OnePage_Content_btnAccept').css('color',$('#mainTittleContent').css('color'));
    $('#ConfirmAnswerRight_OnePage_Content_btnAccept').css('background-color',$('.ConfirmAnswerRight_OnePage').css('background-color'));
    $('#ConfirmAnswerRight_OnePage_Content_Content').css('line-height',$('#ConfirmAnswerRight_OnePage_Content_Content').height() + 'px');
    $('#ConfirmAnswerRight_OnePage_Content_Content').css('font-size',$('#ConfirmAnswerRight_OnePage_Content_btnAccept').height()*0.5 + 'px');
    $('.QuestionResultPanelContent_Bottom').css('color',$('#mainTittleContent').css('color'));
    $('.QuestionResultPanelContent_Bottom_NoScore_Left').css('color',$('#mainTittleContent').css('color'));
    $('.QuestionResultPanelContent_Bottom_NoScore_Right').css('color',$('#mainTittleContent').css('color'));
    $('.trueFalseAnswerRightBlock').each(function(){$(this).css('height',$('#leftMainContent').height() * 0.03 + 'px'); });
}
function GetTextOfQuesAns(eleID){var _val='';if (eleID.indexOf('QuestionPage')>0)var _obj=$('#'+eleID).children(':eq(1)');else var _obj=$('#'+eleID).children().first();var _count=0;while (_val=='' && _count<200){if (_obj.children().first().text()!=''){_obj.children().each(function(){if ($(this).text()!='')_val+=$(this).text();   });} else _obj=_obj.children().first();_count++;}return _val.replace(/(\r\n|\n|\r)/gm,'');}
function CheckAnswer(ansContentID){var _tempTrue=window['_ansTrue'+$('#' + ansContentID).parent().attr('id')];if (_tempTrue.indexOf(ansContentID)>0)return true;else return false;}
function CheckAnswerByQuesID(quesID){
    if ($('#'+quesID).attr('questype').toLowerCase()=='choice' || $('#'+quesID).attr('questype').toLowerCase()=='multichoice'){var _tempTrue=window['_ansTrue'+quesID];var _selectedAns='';$('#'+quesID).children().children().children().children('.CELQuestionPage_1_Answers_IMG').each(function(){if ($(this).attr('src').toLowerCase().indexOf('checked.png')>0) _selectedAns+=$(this).parent().parent().attr('id')+',';});if (_selectedAns==_tempTrue) return true; else return false;}
    if ($('#'+quesID).attr('questype').toLowerCase()=='crosslinking'){var _allMustPare=0;var _pared=0;var _truePare=0;$('#'+quesID).children().each(function(){if (typeof $(this).attr('matching') != typeof undefined && $(this).attr('matching').length > 4  && $(this).attr('matching').substring(0,2)=='VT'){_allMustPare++;if (typeof $(this).attr('pare-matching') != typeof undefined) {_pared++;var _surfix=$(this).attr('toolid');if ($(this).attr('pare-matching') == 'VP_'+_surfix) _truePare++;}}});if (_pared==0){return false;}else{if (_truePare==_allMustPare){return true;}else{return false;}}}
    if ($('#'+quesID).attr('questype').toLowerCase()=='cloze'){var _answerAllBlank=0;var allText=GetTextOfQuesAns(quesID);var _mustFill=0;var _trueFill=0;$('#'+quesID).find('span').each(function(){if (typeof $(this).attr('clozeid')!= typeof undefined){_mustFill++;if (typeof $(this).attr('holderanswerid') == typeof undefined) _answerAllBlank++;else{if ($(this).attr('clozeid') == $('#' + $(this).attr('holderanswerid')).attr('clozeid'))_trueFill++;}}});if (_answerAllBlank>0){return false;}else{if (_mustFill==_trueFill){return true;}else{return false;}}}
    if ($('#'+quesID).attr('questype').toLowerCase()=='truefalse'){var _trueFalseBlank=0;$('#'+quesID).children().children().children().children('.trueFalseAnswerRightBlock_Left_Img').each(function(){if ($(this).attr('src').indexOf('MultiChoice.png')>0 && $(this).parent().parent().children('.trueFalseAnswerRightBlock_Right').children().first().attr('src').indexOf('MultiChoice.png')>0) _trueFalseBlank++;});if (_trueFalseBlank>0){return false;}else{var _wrongAns=0;$('#'+quesID).children().children().children().children('.trueFalseAnswerRightBlock_Left_Img').each(function(){var _trueAns=0;if (typeof $(this).parent().parent().attr('status') != typeof undefined)_trueAns=parseInt($(this).parent().parent().attr('status'));if (_trueAns==1){if (!($(this).attr('src').indexOf('MultiChoiceChecked.png')>0))_wrongAns++;}else{if (!($(this).parent().parent().children('.trueFalseAnswerRightBlock_Right').children().first().attr('src').indexOf('FalseChecked.png')>0))_wrongAns++;}});if (_wrongAns==0) return true; else return false;}}
    if ($('#'+quesID).attr('questype').toLowerCase()=='underline'){var _underPage=$('#'+quesID);var k=false;_underPage.find('.underlineAns').each(function(){if ($(this).parent().attr('iscorrect')=='true' && $(this).hasClass('underlineAnsSelected'))k=true;});return k;}
}
// 08-12-16 - Dũng - Hàm kiểm tra đã trả lời hết các câu hỏi trong nhóm hay chưa
// Phục vụ rẽ nhánh với điều kiện bắt buộc trả lời.
function CheckAnswerByGroupID(groupID)
{
    var result=true;
    $('#leftMainContent').children('.CELPage').each(function()
    {
        if (typeof $(this).attr('groupid') != typeof undefined &&  $(this).attr('groupid') == groupID)
        {
            if (CheckAnswerByQuesID($(this).attr('id')) == false )
                result=false;
        }
    });
    return result;
}
function RemoveEventAfterConfirm(quesID)
{
    if (typeof $('#' + quesID).attr('groupid') != typeof undefined)
    {
        $('#'+quesID).find('.ui-draggable-handle').each(function(){$(this).draggable('disable');});
        $('#'+quesID).find('.underlineAns').each(function(){$(this).off('click');});
        $('#'+quesID).find('.CELQuestionPage_1_Answers_Chk').each(function(){$(this).off('click');});
        $('#'+quesID).find('.trueFalseAnswerRightBlock_Left_Img').each(function(){$(this).off('click');});
        $('#'+quesID).find('.trueFalseAnswerRightBlock_Right_Img').each(function(){$(this).off('click');});
    }
}
function CheckAnswerByGroupIDWithCondition(groupID)
{
    var _result='0'; 0 // 0: Không xác định 1: Sai 2: Đúng
    var _totalQuestion=0;
    var _totalCorrect=0;
    var _ansScore=0;
    var _totalScore=0;
    var _passPercent=0;
    $('#leftMainContent').children('.CELPage').each(function(){if (typeof $(this).attr('groupid') != typeof undefined &&  $(this).attr('groupid') == groupID){_totalQuestion++;_totalScore+=parseInt($(this).attr('score'));_passPercent=parseFloat($(this).attr('passpercent')).toFixed(2);if (CheckAnswerByQuesID($(this).attr('id')) == true ){_totalCorrect++;_ansScore+=parseInt($(this).attr('score'));}}});
    if (_totalScore>0 && _passPercent>0){if (parseFloat(parseFloat(_ansScore*100/_totalScore).toFixed(2)) >= parseFloat(parseFloat(_passPercent).toFixed(2))) _result='2'; else _result='1';}
    if (_totalScore==0 && _passPercent>0){if (parseFloat(parseFloat(_totalCorrect*100/_totalQuestion).toFixed(2)) >= parseFloat(parseFloat(_passPercent).toFixed(2))) _result='2'; else _result='1';}
    return _result;
}
function GetQuestionPageID(idin)
{
    var _result='';
    $('#leftMainContent').children('.CELPage').each(function(){
        if (typeof $(this).attr('jumpid') != typeof undefined && $(this).attr('jumpid') == idin)
            _result=$(this).attr('id');
    });
    return _result;
}
var _listGroupDaReNhanh='';
function ReNhanhCauHoi()
{
    var _result=false;
    var _currentPage=GetCurrentPage();
    if (typeof _currentPage!= typeof undefined && typeof _currentPage.attr('questiongroup')!= typeof undefined)
    {
        _currentPage.find('.ConfirmAnswerRight_AllPage').each(function(){
            if ($(this).css('opacity') == '0.6')
            {
                var _groupQuesResult=CheckAnswerByGroupIDWithCondition(_currentPage.attr('groupid'));
                if (_groupQuesResult=='1') // Rẽ nhánh hướng sai
                {
                    var _failQuestionID=GetQuestionPageID(_currentPage.attr('groupfalse'));
                    if(_failQuestionID != '' && _listGroupDaReNhanh.indexOf(_currentPage.attr('groupid')) <= 0)
                    {
                        if (typeof NextPreviewButtonQuestionPage !== 'undefined' && $.isFunction(NextPreviewButtonQuestionPage)) NextPreviewButtonQuestionPage();
                        if (typeof RestyleQuesOneChoice !== 'undefined' && $.isFunction(RestyleQuesOneChoice)) RestyleQuesOneChoice();
                        if (typeof CreatePareConnectCrossAnswer !== 'undefined' && $.isFunction(CreatePareConnectCrossAnswer)) CreatePareConnectCrossAnswer();
                        $('#leftMainContent').children('.CELPage').css('visibility','');
                        $('#leftMainContent').children('.CELPage').addClass('hidden');
                        clickShowPage(_failQuestionID);
                        $('.DraggablePanel').css('visibility','hidden');
                        $('.DraggablePanel').css('z-index','-1');
                        _listGroupDaReNhanh+=','+_currentPage.attr('groupid');
                        _result=true;
                    }
                }
                if (_groupQuesResult=='2') // Rẽ nhánh hướng đúng
                {
                    var _passQuestionID=GetQuestionPageID(_currentPage.attr('grouppass'));
                    if(_passQuestionID != '' && _listGroupDaReNhanh.indexOf(_currentPage.attr('groupid')) <= 0)
                    {
                        if (typeof NextPreviewButtonQuestionPage !== 'undefined' && $.isFunction(NextPreviewButtonQuestionPage)) NextPreviewButtonQuestionPage();
                        if (typeof RestyleQuesOneChoice !== 'undefined' && $.isFunction(RestyleQuesOneChoice)) RestyleQuesOneChoice();
                        if (typeof CreatePareConnectCrossAnswer !== 'undefined' && $.isFunction(CreatePareConnectCrossAnswer)) CreatePareConnectCrossAnswer();
                        $('#leftMainContent').children('.CELPage').css('visibility','');
                        $('#leftMainContent').children('.CELPage').addClass('hidden');
                        clickShowPage(_passQuestionID);
                        $('.DraggablePanel').css('visibility','hidden');
                        $('.DraggablePanel').css('z-index','-1');
                        _listGroupDaReNhanh+=','+_currentPage.attr('groupid');
                        _result=true;
                    }
                }
            }
        });
    }
    return _result;
}
function CheckEndOfGroup(groupID)
{
    var result=true;
    $('#leftMainContent').children('.CELPage').each(function()
    {
        if (typeof $(this).attr('groupid') != typeof undefined &&  $(this).attr('groupid') == groupID)
        {
            $(this).find('.ConfirmAnswerRight_OnePage').each(function(){
                if ($(this).css('opacity') != '0.6')
                    result=false;
            });
        }
    });
    if (result==true)
    {
        $('#leftMainContent').children('.CELPage').each(function()
        {
            if (typeof $(this).attr('groupid') != typeof undefined &&  $(this).attr('groupid') == groupID)
            {
                $(this).find('.ConfirmAnswerRight_AllPage').each(function(){
                    $(this).trigger('click');
                    $(this).css('opacity','0.6');
                });
            }
        });
    }
}
function CheckAnswerByQuesIDApart(quesID)
{
    if ($('#'+quesID).attr('questype').toLowerCase()=='choice' || $('#'+quesID).attr('questype').toLowerCase()=='multichoice'){var _tempTrue=window['_ansTrue'+quesID];var _selectedAns='';$('#'+quesID).find('.CELQuestionPage_1_Answers_IMG').each(function(){if ($(this).attr('src').toLowerCase().indexOf('checked.png')>0) _selectedAns+=$(this).parent().parent().attr('id')+',';});if (_selectedAns.length>0) return true; else return false;}
    if ($('#'+quesID).attr('questype').toLowerCase()=='crosslinking'){var _allMustPare=0;var _pared=0;var _truePare=0;$('#'+quesID).children().each(function(){if (typeof $(this).attr('matching') != typeof undefined && $(this).attr('matching').length > 4  && $(this).attr('matching').substring(0,2)=='VT'){_allMustPare++;if (typeof $(this).attr('pare-matching') != typeof undefined) _pared++;}});if (_pared==0){return false;}else{return true;}}
    if ($('#'+quesID).attr('questype').toLowerCase()=='cloze'){var _answerAllBlank=0;var allText=GetTextOfQuesAns(quesID);var _mustFill=0;var _trueFill=0;$('#'+quesID).find('span').each(function(){if (typeof $(this).attr('clozeid')!= typeof undefined){_mustFill++;if (typeof $(this).attr('holderanswerid') == typeof undefined) _answerAllBlank++; else _trueFill++;}});if (_trueFill>0){return true;}else{return false;}}
    if ($('#'+quesID).attr('questype').toLowerCase()=='truefalse'){var _trueFalseBlank=0;$('#'+quesID).find('.trueFalseAnswerRightBlock_Left_Img').each(function(){if ($(this).attr('src').indexOf('MultiChoiceChecked.png')>0) _trueFalseBlank++;});$('#'+quesID).find('.trueFalseAnswerRightBlock_Right_Img').each(function(){if ($(this).attr('src').indexOf('FalseChecked.png')>0) _trueFalseBlank++;});if (_trueFalseBlank==0){return false;}else{return true;}}
    if ($('#'+quesID).attr('questype').toLowerCase()=='underline'){var _underPage=$('#'+quesID);var k=false;_underPage.find('.underlineAns').each(function(){if ($(this).hasClass('underlineAnsSelected')) k=true;});return k;}
}
//  End of General - Kết thúc code dùng chung
function CountAnswerMaxTime()
{
    clearInterval(timeQuestionPageInterval);
    var _currentPage=GetCurrentQuestionPage();
    if (typeof _currentPage!=typeof undefined)
    {
        if (typeof _currentPage.attr('maxtime')!= typeof undefined)
            timeQuestionPageInterval = setInterval(CountQuestionPageTime, 1000);
    }
}
var timeQuestionPageInterval;
var CurrentGroupID;
function CountQuestionPageTime()
{
    var _currentPage=GetCurrentQuestionPage();
    if (typeof _currentPage.attr('groupid')!=typeof undefined && CurrentGroupID!=_currentPage.attr('groupid')) CurrentGroupID=_currentPage.attr('groupid');
    if (typeof _currentPage.attr('grouptimeleft') == typeof undefined)  _currentPage.attr('grouptimeleft',_currentPage.attr('questiongrouptime'));
    var _leftGroupTime=parseInt(_currentPage.attr('grouptimeleft')); _leftGroupTime--;
    if (_leftGroupTime<0)  _leftGroupTime=0;
    _currentPage.attr('grouptimeleft',_leftGroupTime);
    $('#leftMainContent').children('.CELPage').each(function(){if (typeof $(this).attr('groupid') != typeof undefined &&  $(this).attr('groupid') == CurrentGroupID){$(this).attr('grouptimeleft',_leftGroupTime);}});
    if (parseInt(_currentPage.attr('questiongrouptime'))>0 && _leftGroupTime==0) {_currentPage.find('.ConfirmAnswerRight_OnePage').css('opacity','0.6');_currentPage.find('.ConfirmAnswerRight_AllPage').trigger('click');return;}
    if (typeof _currentPage.attr('lefttime')== typeof undefined) _currentPage.attr('lefttime',_currentPage.attr('maxtime'));
    var _leftTime=parseInt(_currentPage.attr('lefttime'));
    _leftTime--;
    if (_leftTime<0) _leftTime=0;
    _currentPage.attr('lefttime',_leftTime);
    var _timeContent=(new Date).clearTime().addSeconds(_leftTime).toString('mm:ss');
    _currentPage.find('.ConfirmAnswerLeft_Middle_Time_Right').children().text(_timeContent);
    if (parseInt(_currentPage.attr('maxtime'))>0 && _leftTime==0) {_currentPage.find('.ConfirmAnswerRight_OnePage').trigger('click');}
}
// Single or Multi choice Question - Câu trắc nghiệm đơn hoặc nhiều lựa chọn
// Enf of Single or Multi choice Question - Hết câu trắc nghiệm đơn hoặc nhiều lựa chọn
// Fill in blank Question - Câu điền khuyết.
function ClozeAnswerListQuestionView(questionID){
    var ele1=$('#'+questionID);
    var ele2=ele1.clone();
    var htmlAns='';
    ele2.attr('id',ele2.attr('id')+'_Clone');
    ele2.children().children().each(function(){
        if (typeof $(this).attr('id')!= typeof undefined) 
            $(this).removeAttr('id');
    });
    ele2.find('span').each(function(){
        if (typeof $(this).attr('clozeid')!=typeof undefined){
            var holderID='';
            if (typeof $(this).attr('holderanswerid') != typeof undefined) 
                holderID=$(this).attr('holderanswerid');
            if (holderID!=''){
                if ($('#'+holderID).attr('clozeid')==$(this).attr('clozeid')) 
                {
                    $(this).css('border','1px solid green');
                }
                else
                {
                    $(this).css('border','1px solid red');
                    var _cloneAnswer=$('#'+holderID).clone();
                    _cloneAnswer.children().each(function(){$(this).attr('id',_cloneAnswer.attr('id')+'_Clone')});
                    $(this).find('span').each(function(){$(this).css('background','');$(this).css('background-color','');});
                    _cloneAnswer.children().children().children().each(function(){
                        if (typeof $(this).attr('id')!=typeof undefined){
                            $(this).removeAttr('id');
                            $(this).parent().css('line-height','1');
                        }
                    });
                    htmlAns+="<div class='ClozeAnswerView'>";
                    htmlAns+="<div class='ClozeAnswerView_Left' style='overflow-y:auto; word-wrap:break-word'>"+_cloneAnswer.html()+"</div>";
                    holderID=$(this).attr('clozeid');
                    $('#leftMainContent').children().children().each(function(){
                        if (typeof $(this).attr('clozeid')!=typeof undefined && $(this).attr('clozeid')==holderID)
                            holderID=$(this).attr('id');
                    });
                    var _cloneAnswerRight=$('#'+holderID);
                    _cloneAnswerRight.children().each(function(){                        $(this).attr('id',_cloneAnswerRight.attr('id')+'_Clone');                        $(this).find('span').each(function(){$(this).css('background','');$(this).css('background-color','');});
});
                    _cloneAnswerRight.children().children().children().each(function(){
                        if (typeof $(this).attr('id')!=typeof undefined){
                            $(this).removeAttr('id');
                            $(this).parent().css('line-height','1');
                        }
                    });
                    htmlAns+="<div class='ClozeAnswerView_Center'><img class='ClozeAnswerView_Center_IMG' src='images/Button/Question/ClozeArrow.png'></div>";
                    htmlAns+="<div class='ClozeAnswerView_Right'>"+_cloneAnswerRight.html()+"</div>";
                    htmlAns+='</div>';
                }
            }
            else
            {
                $(this).css('border','1px solid orange');
                var _tempText='';var _tempClozeId=$(this).attr('clozeid');
                ele1.parent().children().each(function(){
                    if (typeof $(this).attr('clozeid')!=typeof undefined && $(this).attr('clozeid')==_tempClozeId)
                        _tempText=$(this).children().children().children().text();
                });
                $(this).text(_tempText);
            }
        }
    });
    ele2.children().css('word-wrap','break-word');
    ele2.children().css('padding','3px 1px');
    return htmlAns;
}
function CloneStyleClozeQuestions(questionID){
    var ele1=$('#'+questionID);
    var ele2=ele1.clone();
    ele2.children().remove('svg');
    ele2.children().css('position','');
    ele2.css('position','');
    ele2.children().css('line-height','1');
    ele2.attr('id',ele2.attr('id')+'_Clone');
    ele2.children().children().each(function(){
        if (typeof $(this).attr('id')!= typeof undefined) $(this).removeAttr('id');
    });
    ele2.find('span').each(function(){
        $(this).css('line-height','1');
        if (typeof $(this).attr('clozeid')!=typeof undefined){
            var holderID='';
            if (typeof $(this).attr('holderanswerid') != typeof undefined) holderID=$(this).attr('holderanswerid');
                if (holderID!=''){
                    if ($('#'+holderID).attr('clozeid')==$(this).attr('clozeid')) {
                            $(this).css('border-bottom','1px solid green');
                            $(this).css('color','green');
                        }else{
                            $(this).css('border-bottom','1px solid red');
                            $(this).css('color','red');
                        }
                }else{
                    $(this).css('border-bottom','1px solid orange');
                    $(this).css('color','orange');
                    var _tempText='';var _tempClozeId=$(this).attr('clozeid');
                    ele1.parent().children().each(function(){
                    if (typeof $(this).attr('clozeid')!=typeof undefined && $(this).attr('clozeid')==_tempClozeId)
                        _tempText=$(this).children().children().children().text();
                });
                $(this).text(_tempText);
            }
        }
    });
    ele2.children().css('word-wrap','break-word');ele2.children().css('padding','3px 1px');
    return ele2;
}
// End of Fill in blank Question - Hết câu điền khuyết
// CrossLink Question - Câu hỏi nối chéo
function CrossLinkReivewInit(){
    $('.CrossLinkingAnswerReview').css('height',$('.ViewQuestionPanel_Content_Bottom_AnswerList').height()*0.425 + 'px');
    $('.CrossLinkingAnswerReview_Connect_Sub').each(function(){
        var _middle=$(this).parent().children('.CrossLinkingAnswerReview_Middle');
        $(this).css('border-top',_middle.css('border-top'));
        $(this).css('border-bottom',_middle.css('border-bottom'));
    })
    $('.CrossLinkingAnswerReview_Connect').children().children().each(function(){
        var _cW = $(this).parent().width();var _cH = $(this).parent().height();
        $(this).attr('d',
            ' M 0 , 0' + 
            ' L 0 , ' + (_cH/3) +
            ' C ' + _cW + ' , ' + (_cH/3) + ' ' + _cW + ' , ' + (_cH*2/3) + ' ' + 0 + ' , ' + (_cH*2/3) +
            ' L 0 , '+_cH );
        $(this).attr('stroke',$(this).parent().parent().parent().children('.CrossLinkingAnswerReview_Left').css('border-top-color'));
        $(this).attr('stroke-width',$(this).parent().parent().parent().children('.CrossLinkingAnswerReview_Left').attr('border-top-width'));
        $(this).attr('fill','white');
    });
    $('.CrossLinkingAnswerReview_ConnectRight').children().children().each(function(){
        var _cW = $(this).parent().width();var _cH = $(this).parent().height();
        $(this).attr('d',
            ' M ' + _cW + ' , ' + 0.5 +
            ' L 0.5 , 0.5 ' + 
            ' M 0 , 0' + 
            ' L 0 , ' + (_cH/3) +
            ' C ' + _cW + ' , ' + (_cH/3) + ' ' + _cW + ' , ' + (_cH*2/3) + ' ' + 0 + ' , ' + (_cH*2/3) +
            ' L 0 , '+_cH + 
            ' M ' + 0.5 + ' , ' + (_cH-0.5) +
            ' L ' + (_cW-0.5) + ' , ' + (_cH-0.5) );
        $(this).attr('stroke',$(this).parent().parent().parent().children('.CrossLinkingAnswerReview_Left').css('border-top-color'));
        $(this).attr('stroke-width',$(this).parent().parent().parent().children('.CrossLinkingAnswerReview_Left').attr('border-top-width'));
        $(this).attr('fill','white');
        $(this).attr('fill','white');
    });
}
function CreatePareConnectCrossAnswer(){
    $('.AnswerContentCross_Left').each(function(){$(this).css('width',$(this).parent().width() + 'px');$(this).parent().children(':eq(1)').css('background-color','transparent');$(this).parent().children(':eq(1)').css('border-color','transparent');});
    $('.AnswerContentCross_Right').each(function(){$(this).css('width',$(this).parent().width() + 'px');$(this).parent().children(':eq(1)').css('background-color','transparent');$(this).parent().children(':eq(1)').css('border-color','transparent');});
    $('.AnswerContent_Cross_Left_Circle').each(function(){
        var cH=$('#leftMainContent').height()*0.065;
        var cW=$('#leftMainContent').width()*0.022;
        var parW=$(this).parent().width();
        var bW=parseFloat($(this).parent().parent().parent().children(':eq(1)').css('border-top-width'));
        var bM=parseFloat(bW/2);
        var leftW=$(this).parent().parent().parent().children(':eq(1)').width();
        var parH=$(this).parent().height();
        var bgPY=0;
        var bgPY=0;
        bgPY=(parH-cH)/2 + bM;
        ePY=bgPY+cH - bW;
        $(this).attr('d',
            ' M ' + bM + ',' + bM + 
            ' L ' + (leftW+bW + bM) + ',' +  bM +
            ' L ' + (leftW+bW+bM) + ', ' + (bgPY) +
            ' C ' + (leftW + cW + bM) + ' ' + (bgPY) + ' ' + (leftW + cW  + bM) + ' ' + (ePY) + ' ' + (leftW + bW + bM) + ' ' + (ePY) +
            ' L ' + (leftW + bW + bM) + ',' + (parH) +
            ' M ' + (leftW + bW + bM) + ',' + (parH-bM) +
            ' L ' + bM + ',' +  (parH-bM) +
            ' L ' + bM + ',0');
        $(this).attr('stroke',$(this).parent().parent().parent().attr('realBorderColor'));
        $(this).attr('stroke-width',bW);
        $(this).attr('fill',$(this).parent().parent().parent().attr('realBgc'));
    });
    $('.AnswerContent_Cross_Right_Circle').each(function(){ 
        var cH=$('#leftMainContent').height()*0.065;
        var cW=$('#leftMainContent').width()*0.022;
        var parH=$(this).parent().height();
        var parW=$(this).parent().width();
        var bW=parseFloat($(this).parent().parent().parent().children(':eq(1)').css('border-top-width'));
        var bM=parseFloat(bW/2);
        var rightW=$(this).parent().parent().parent().children(':eq(1)').width();
        var bgPY=0;
        var ePY=0;
        bgPY=(parH-cH)/2;
        ePY=bgPY+cH;
        $(this).attr('d',
            ' M ' + bM +', '+ 0 +
            ' L ' + bM + ',' + bgPY + 
            ' C ' + cW + ' ' + bgPY + ' ' + cW + ' ' + ePY + ' ' + bM + ' ' + ePY + 
            ' L ' + bM +',' + (parH-bM) + 
            ' L ' + (parW - bM ) + ',' +(parH-bM) + 
            ' L ' + (parW - bM )+','+ bM + 
            ' L0,' + bM);
        $(this).attr('stroke',$(this).parent().parent().parent().attr('realBorderColor'));
        $(this).attr('stroke-width',bW);
        $(this).attr('fill',$(this).parent().parent().parent().attr('realBgc'));
    });
}
function CrossLink_CloneTrueRight(answerObject){
    var _trueObject;var _result;var ansParent=answerObject.parent();
    ansParent.children().each(function(){
        if (typeof $(this).attr('matching') != typeof undefined && $(this).attr('matching').substring(3,$(this).attr('matching').length) == answerObject.attr('toolId'))
            _trueObject=$(this).children(':eq(1)');
    });
    if (typeof _trueObject!= typeof undefined){
        _trueObject.children().each(function(){if (typeof $(this).attr('id') != typeof undefined) $(this).attr('id',$(this).attr('id')+'_Clone');});
        _trueObject.children().children().each(function(){if (typeof $(this).attr('id') != typeof undefined) $(this).attr('id',$(this).attr('id')+'_Clone');});
        _trueObject.children().children().children().each(function(){if (typeof $(this).attr('id') != typeof undefined) $(this).attr('id',$(this).attr('id')+'_Clone');});
        _trueObject.css('width','100%');_trueObject.css('height','100%');_result=_trueObject.html();
    }else _result='';
    return _result;
}
function CrossLink_CloneParingRight(answerObject){
    var _pareObject;var _result;var ansParent=answerObject.parent();
    ansParent.children().each(function(){
        if (typeof $(this).attr('pare-matching') != typeof undefined && $(this).attr('pare-matching') == answerObject.attr('matching'))
            _pareObject=$(this).children(':eq(1)');
    });
    if (typeof _pareObject != typeof undefined){
        _pareObject.children().each(function(){if (typeof $(this).attr('id') != typeof undefined) $(this).attr('id',$(this).attr('id')+'_Clone');});
        _pareObject.children().children().each(function(){if (typeof $(this).attr('id') != typeof undefined) $(this).attr('id',$(this).attr('id')+'_Clone');});
        _pareObject.children().children().children().each(function(){if (typeof $(this).attr('id') != typeof undefined) $(this).attr('id',$(this).attr('id')+'_Clone');});
        _pareObject.css('width','100%');_pareObject.css('height','100%');_result=_pareObject.html();
    }else _result='';
    return _result;
}
function CrossLinkAnswerReview(questionID){
    var _quesID = $('#' + questionID);var _htmlAppendAnswer='';
    _quesID.children().each(function(){
        if ($(this).attr('id').indexOf('AnswerContent')>-1){
            var _subAnswer=$(this).children(':eq(1)').clone();
            _subAnswer.children().each(function(){if (typeof $(this).attr('id') != typeof undefined)$(this).attr('id',$(this).attr('id')+'_Clone');});
            _subAnswer.children().children().each(function(){if (typeof $(this).attr('id') != typeof undefined)$(this).attr('id',$(this).attr('id')+'_Clone');});
            _subAnswer.children().children().children().each(function(){if (typeof $(this).attr('id') != typeof undefined)$(this).attr('id',$(this).attr('id')+'_Clone');});
            // Tìm các câu thuộc vế trái có đáp án
            if ($(this).attr('matching').substring(0,2) =='VT' && $(this).attr('matching').length>3){
                _htmlAppendAnswer+='<div class="CrossLinkingAnswerReview">';
                var _cloneTrue=CrossLink_CloneTrueRight($(this));var _cloneParing=CrossLink_CloneParingRight($(this));
                var _paring = $(this).attr('pare-matching');
                if (typeof _paring!= typeof undefined){ 
                    var _subParing=_paring.substring(3,_paring.length);
                    //Nếu trả lời đúng
                    if (_subParing == $(this).attr('toolId')) {
                        // Vẽ đáp án vế trái
                        _htmlAppendAnswer+='<div class="CrossLinkingAnswerReview_Left" style="border: 1px solid green; border-right-width:0px;">' + _subAnswer.html() + '</div>';
                        // Vẽ connect
                        _htmlAppendAnswer+='<div class="CrossLinkingAnswerReview_Connect"><svg width="100%" height="100%"><path></path></svg></div><div class="CrossLinkingAnswerReview_Connect_Sub"></div>';
                        // Vẽ đáp án vể phải
                        _htmlAppendAnswer+='<div class="CrossLinkingAnswerReview_Middle" style="border: 1px solid green; border-left-width:0px;">' + _cloneParing + '</div>';
                        // Vẽ Connect phụ
                        _htmlAppendAnswer+='<div class="CrossLinkingAnswerReview_ConnectRight"><svg width="100%" height="100%"><path></path></svg></div>';
                        // Vẽ đáp án đúng với vế trái
                        _htmlAppendAnswer+='<div class="CrossLinkingAnswerReview_Right">' + _cloneTrue + '</div>';
                    }else{  //Nếu trả lời sai
                        // Vẽ đáp án vế trái
                        _htmlAppendAnswer+='<div class="CrossLinkingAnswerReview_Left" style="border: 1px solid green; border-right-width:0px;">' + _subAnswer.html() + '</div>';
                        // Vẽ connect
                        _htmlAppendAnswer+='<div class="CrossLinkingAnswerReview_Connect"><svg width="100%" height="100%"><path></path></svg></div><div class="CrossLinkingAnswerReview_Connect_Sub"></div>';
                        // Vẽ đáp án vể phải
                        _htmlAppendAnswer+='<div class="CrossLinkingAnswerReview_Middle" style="border: 1px solid red; border-left-width:0px;">' + _cloneParing + '</div>';
                        // Vẽ Connect phụ
                        _htmlAppendAnswer+='<div class="CrossLinkingAnswerReview_ConnectRight"><svg width="100%" height="100%"><path></path></svg></div>';
                        // Vẽ đáp án đúng với vế trái
                        _htmlAppendAnswer+='<div class="CrossLinkingAnswerReview_Right">' + _cloneTrue + '</div>';   
                    }
                }else{ // Nếu không trả lời
                    // Vẽ đáp án vế trái
                    _htmlAppendAnswer+='<div class="CrossLinkingAnswerReview_Left" style="border: 1px solid orange; border-right-width:0px;">' + _subAnswer.html() + '</div>';
                    // Vẽ connect
                    _htmlAppendAnswer+='<div class="CrossLinkingAnswerReview_Connect"><svg width="100%" height="100%"><path></path></svg></div><div class="CrossLinkingAnswerReview_Connect_Sub"></div>';
                    // Vẽ đáp án vể phải
                    _htmlAppendAnswer+='<div class="CrossLinkingAnswerReview_Middle"  style="border: 1px solid orange; border-left-width:0px;">' + _cloneTrue + '</div>';
                }
                _htmlAppendAnswer+='</div>';
            }
        }
    });
    return _htmlAppendAnswer;
}
function Align2CrossSide(dragMatching,targetMatching){
    var _leftMainW=parseFloat($('#leftMainContent').css('width'));
    var _leftMainH=parseFloat($('#leftMainContent').css('height'));
    var _targetBorderW=parseFloat(targetMatching.children(':eq(1)').css('border-top-width'));
    var _dragBorderW=parseFloat(dragMatching.children(':eq(1)').css('border-top-width'));
    var _targetLeft=parseFloat(targetMatching.css('left'));
    var _dragLeft=parseFloat(dragMatching.css('left'));
    var _targetW=parseFloat(targetMatching.width());
    var _dragW=parseFloat(dragMatching.width());
    var _targetConnectW=parseFloat(_targetW - targetMatching.children(':eq(1)').width());
    var _dragConnectW=parseFloat(_dragW - dragMatching.children(':eq(1)').width());
    var _subStr=dragMatching.attr('matching').substring(0,2);
    // Nếu drag là Vế trái, thực hiện đổi vị trí vế trái
    if (_subStr=='VT'){
        var _left;
        if (_dragBorderW>_targetBorderW)
            _left=parseFloat((_targetLeft-_dragW + _dragConnectW - _dragBorderW - _targetBorderW)/_leftMainW) * 100;
        else
            _left=parseFloat((_targetLeft-_dragW + _dragConnectW - _dragBorderW  )/_leftMainW) * 100;
        var _targetTop=parseFloat(targetMatching.css('top')) + targetMatching.height()/2;
        var _dragTop=parseFloat(dragMatching.css('top'))  + dragMatching.height()/2;
        var _div;
        if (dragMatching.height()>targetMatching.height()){
            if (_dragTop>_targetTop)
                {_div=parseFloat(targetMatching.css('top')) - (_dragTop-_dragTop) - (dragMatching.height()-targetMatching.height())/2;}
            else
                {_div=parseFloat(dragMatching.css('top')) + (_targetTop-_dragTop);}
        }else{
            if (_dragTop>_targetTop)
                _div=parseFloat(targetMatching.css('top')) - (_dragTop-_dragTop) + (targetMatching.height()-dragMatching.height())/2;
            else
                _div=parseFloat(dragMatching.css('top')) + (_targetTop-_dragTop);
        }
        dragMatching.animate({top:parseFloat( (_div/_leftMainH)*100)  + '%',left: _left + '%'},400);
    }else{
        var _left;
        if (_dragBorderW<_targetBorderW)
            _left=parseFloat((_targetLeft + _targetW - _targetConnectW + _targetBorderW + _dragBorderW)/_leftMainW) * 100;
        else
            _left=parseFloat((_targetLeft + _targetW - _targetConnectW + _targetBorderW)/_leftMainW) * 100;
        var _targetTop=parseFloat(targetMatching.css('top')) + targetMatching.height()/2;
        var _dragTop=parseFloat(dragMatching.css('top'))  + dragMatching.height()/2;
        var _div;
        if (dragMatching.height()>targetMatching.height()){
            if (dragMatching.height()>targetMatching.height())
                {_div=parseFloat(targetMatching.css('top')) - (_dragTop-_dragTop) - (dragMatching.height()-targetMatching.height())/2;}
            else
                {_div=parseFloat(dragMatching.css('top')) + (_targetTop-_dragTop);}
        }else{
            if (_dragTop>_targetTop)
                _div=parseFloat(targetMatching.css('top')) - (_dragTop-_dragTop)+ (targetMatching.height()-dragMatching.height())/2;
            else
                _div=parseFloat(dragMatching.css('top')) + (_targetTop-_dragTop);
        }
        dragMatching.animate({top:parseFloat( (_div/_leftMainH)*100)  + '%',left: _left + '%'},400);
    }
}
function findTagetParingElement(paringElement){
    var parentEle=paringElement.parent();
    var paringStr=paringElement.attr('matching').substring(3,paringElement.attr('matching').length);
    var _result='';
    parentEle.children().each(function(){
        if (typeof $(this).attr('pare-matching') != typeof undefined && $(this).attr('pare-matching').substring(3,$(this).attr('pare-matching').length) == paringStr)
            _result=$(this).attr('id');
    });
    return _result;
}
// Lấy danh sách các câu trả lời đang chạm vào câu trả lời đang di chuyển.
function CrossLinkGetTouchIDList(draggingAns,bothSide)
{
    var _result='';
    var _currentPage=GetCurrentQuestionPage();
    if (typeof _currentPage != typeof undefined)
    {
        var _draggingSide=draggingAns.attr('matching').substring(0,2);
        var X=0;
        var UpY=0;
        var BotY=0;
        if (typeof draggingAns.attr('matching') != typeof undefined && _draggingSide =='VT')
        {
            if (bothSide==0)
            {
                X=parseFloat(draggingAns.css('left')) + parseFloat(draggingAns.width());
                UpY=parseFloat(draggingAns.css('top'));
                BotY=parseFloat(draggingAns.height()) + UpY;
            }else{
                X=parseFloat(draggingAns.css('left'));
                UpY=parseFloat(draggingAns.css('top'));
                BotY=parseFloat(draggingAns.height()) + UpY;
            }
        }else{
            if (bothSide==0)
            {
                X=parseFloat(draggingAns.css('left'));
                UpY=parseFloat(draggingAns.css('top'));
                BotY=parseFloat(draggingAns.height()) + UpY;
            }else{
                X=parseFloat(draggingAns.css('left')) + parseFloat(draggingAns.width());
                UpY=parseFloat(draggingAns.css('top'));
                BotY=parseFloat(draggingAns.height()) + UpY;
            }
        }
        var X1=0;var X2=0;var Y1=0;var Y2=0;
        var min=0; var temp=0; var first=0;
        // Duyệt qua toàn bộ các khung đáp án không phải là dragging
        _currentPage.children().each(function(){
            if (bothSide==0)
            {
                if (typeof $(this).attr('id') != typeof undefined 
                    && $(this).attr('id').indexOf('AnswerContent')>=0 
                    && $(this).index() != draggingAns.index() 
                    && typeof $(this).attr('matching')!=typeof undefined 
                    && $(this).attr('matching').substring(0,2)!=_draggingSide)
                {
                    X1=parseFloat($(this).css('left'));
                    X2=parseFloat($(this).css('left')) + parseFloat($(this).width());
                    Y1=parseFloat($(this).css('top'));
                    Y2=parseFloat($(this).height()) + Y1;
                    if (X>X1 && X<X2 && ((UpY>Y1 && UpY<Y2) || (BotY>Y1 && BotY<Y2)))
                    {
                        temp=parseFloat($(this).css('top'));
                        if (temp<min) {min=parseFloat($(this).css('top'));_result=$(this).attr('id');}
                        if (first<1){ first=temp; min=first;_result=$(this).attr('id');} 
                    }
                }
            }else{
                if (typeof $(this).attr('id') != typeof undefined 
                    && $(this).attr('id').indexOf('AnswerContent')>=0 
                    && $(this).index() != draggingAns.index() 
                    && typeof $(this).attr('matching')!=typeof undefined 
                    && $(this).attr('matching').substring(0,2)==_draggingSide)
                {
                    X1=parseFloat($(this).css('left'));
                    X2=parseFloat($(this).css('left')) + parseFloat($(this).width());
                    Y1=parseFloat($(this).css('top'));
                    Y2=parseFloat($(this).height()) + Y1;
                    if (X>X1 && X<X2 && ((UpY>Y1 && UpY<Y2) || (BotY>Y1 && BotY<Y2)))
                    {
                        temp=parseFloat($(this).css('top'));
                        if (temp<min) {min=parseFloat($(this).css('top'));_result=$(this).attr('id');}
                        if (first<1){ first=temp; min=first;_result=$(this).attr('id');}
                    }
                }
            }
        });
        if (_result=='') // Nếu không tìm được đối tượng dragging đè lên, tìm đối tượng đè lên dragging
        {
            X1=parseFloat(draggingAns.css('left'));
            X2=parseFloat(draggingAns.css('left')) + parseFloat(draggingAns.width());
            Y1=parseFloat(draggingAns.css('top'));
            Y2=parseFloat(draggingAns.height()) + Y1;
            _currentPage.children().each(function(){
                if (typeof $(this).attr('matching') != typeof undefined && $(this) =='VT')
                {
                    if (bothSide==0)
                    {
                        X=parseFloat($(this).css('left')) + parseFloat($(this).width());
                        UpY=parseFloat($(this).css('top'));
                        BotY=parseFloat($(this).height()) + UpY;
                    }else{
                        X=parseFloat($(this).css('left'));
                        UpY=parseFloat($(this).css('top'));
                        BotY=parseFloat($(this).height()) + UpY;
                    }
                }else{
                    if (bothSide==0)
                    {
                        X=parseFloat($(this).css('left'));
                        UpY=parseFloat($(this).css('top'));
                        BotY=parseFloat($(this).height()) + UpY;
                    }else{
                        X=parseFloat($(this).css('left')) + parseFloat($(this).width());
                        UpY=parseFloat($(this).css('top'));
                        BotY=parseFloat($(this).height()) + UpY;
                    }
                }
                if (bothSide==0)
                {
                    if (typeof $(this).attr('id') != typeof undefined
                        && $(this).attr('id').indexOf('AnswerContent')>=0
                        && $(this).index() != draggingAns.index()
                        && typeof $(this).attr('matching')!=typeof undefined
                        && $(this).attr('matching').substring(0,2)!=_draggingSide)
                    {
                        if (X>X1 && X<X2 && ((UpY>Y1 && UpY<Y2) || (BotY>Y1 && BotY<Y2)))
                        {
                            temp=parseFloat($(this).css('top'));
                            if (temp<min) {min=parseFloat($(this).css('top'));_result=$(this).attr('id');}
                            if (first<1){ first=temp; min=first;_result=$(this).attr('id');} 
                        }
                    }
                }else{
                    if (typeof $(this).attr('id') != typeof undefined
                        && $(this).attr('id').indexOf('AnswerContent')>=0
                        && $(this).index() != draggingAns.index()
                        && typeof $(this).attr('matching')!=typeof undefined
                        && $(this).attr('matching').substring(0,2)==_draggingSide)
                    {
                        if (X>X1 && X<X2 && ((UpY>Y1 && UpY<Y2) || (BotY>Y1 && BotY<Y2)))
                        {
                            temp=parseFloat($(this).css('top'));
                            if (temp<min) {min=parseFloat($(this).css('top'));_result=$(this).attr('id');}
                            if (first<1){ first=temp; min=first;_result=$(this).attr('id');}
                        }
                    }
                    }
                });
        }
    }
    return _result;
}
function CrossLinkPare(draggingAns)
{
    var _targetID=CrossLinkGetTouchIDList(draggingAns,0);
    if (typeof draggingAns.attr('pare-matching')!=typeof undefined)// Nếu dragging đang pare
    {
        var _dragParingID=findTagetParingElement(draggingAns);
        if (typeof _dragParingID != typeof undefined &&  _dragParingID!='')
        {
            var _dragParing=$('#' + _dragParingID);
            _dragParing.removeAttr('pare-matching');
            draggingAns.removeAttr('pare-matching');
            _dragParing.animate({top:parseFloat(_dragParing.attr('loadtop'))  + '%',left: parseFloat(_dragParing.attr('loadleft')) + '%'},220);
        }
    }
    if (_targetID=='') // Nếu không tìm được target
    {
        draggingAns.animate({top:parseFloat(draggingAns.attr('loadtop'))  + '%',left: parseFloat(draggingAns.attr('loadleft')) + '%'},220);
    }else{
        var target=$('#' + _targetID);
        if (typeof target.attr('pare-matching') != typeof undefined) // Nếu target đang pare
        {
            var _targetPareID=findTagetParingElement(target);
            if (typeof _targetPareID!=typeof undefined && _targetPareID!='')
            {
                var _targetPare=$('#' + _targetPareID);
                _targetPare.removeAttr('pare-matching');
                _targetPare.animate({top:parseFloat(_targetPare.attr('loadtop'))  + '%',left: parseFloat(_targetPare.attr('loadleft')) + '%'},220);
                target.removeAttr('pare-matching');
            }
        }
        if (typeof target.attr('pare-matching')==typeof undefined) // Nếu target chưa pare
        {
            draggingAns.attr('pare-matching',target.attr('matching'));
            target.attr('pare-matching',draggingAns.attr('matching'));
            Align2CrossSide(draggingAns,target);
            //kiểm tra chèn cùng vế đổi vị trí
            window.setTimeout(function(){
                var colli=CrossLinkGetTouchIDList(draggingAns,1);
                if (colli!='')
                {
                    var colliObj=$('#' + colli);
                    var tempTop=0;var tempLeft=0;
                    tempTop=parseFloat(colliObj.attr('loadtop'));
                    tempLeft=parseFloat(colliObj.attr('loadleft'));
                    colliObj.attr('loadtop',draggingAns.attr('loadtop'));
                    colliObj.attr('loadleft',draggingAns.attr('loadleft'));
                    draggingAns.attr('loadtop',tempTop);
                    draggingAns.attr('loadleft',tempLeft);
                    colliObj.animate({top:parseFloat(colliObj.attr('loadtop'))  + '%',left: parseFloat(colliObj.attr('loadleft')) + '%'},220);
                }
            }, 350);
        }
    }
}
//  End of CrossLink Question - Hết câu hỏi nối chéo
// True false Question - Câu hỏi đúng sai
$('.trueFalseAnswerRightBlock_Left_Img').on('click',function(){if ($(this).attr('src').indexOf('MultiChoice.png')>0){$(this).attr('src','images/button/Question/MultiChoiceChecked.png');$(this).parent().parent().children('.trueFalseAnswerRightBlock_Right').children().first().attr('src','images/button/Question/MultiChoice.png');}else $(this).attr('src','images/button/Question/MultiChoice.png');});
$('.trueFalseAnswerRightBlock_Right_Img').on('click',function(){if ($(this).attr('src').indexOf('MultiChoice.png')>0){$(this).attr('src','images/button/Question/FalseChecked.png');$(this).parent().parent().children('.trueFalseAnswerRightBlock_Left').children().first().attr('src','images/button/Question/MultiChoice.png');}else $(this).attr('src','images/button/Question/MultiChoice.png');});
function TrueFalseQuesReviewAnswer(quesID)
{
    var _quesID=$('#' + quesID);
    var _htmlAppendAnswer='';
    var _tempArr=0;
    _quesID.children().each(function(){
        if ($(this).attr('id').indexOf('AnswerContent')>-1){
            if (_tempArr%2==0)
                _htmlAppendAnswer+='<div class="MultiChoiceAnswerReview">';
            _tempArr++;
            // Kiểm tra đã trả lời chưa
            var _answered=0; // 0 chưa trả lời, 1 chọn đúng , 2 chọn sai
            $(this).children().children().children().each(function()
            {
                if (typeof $(this).attr('src') != typeof undefined && $(this).attr('src').indexOf('MultiChoiceChecked.png')>0) _answered=1;
                if (typeof $(this).attr('src') != typeof undefined && $(this).attr('src').indexOf('FalseChecked.png')>0) _answered=2;
            });
            _htmlAppendAnswer+='<div class="MultiChoiceAnswerReview_ILBlock">';
            if (_answered==0)
            {
                // Lấy nội dung ra vế trái
                _htmlAppendAnswer+='<div class="TrueFalseAnswerReview_ILBlock_Left" style="border: 1px solid orange; overflow-y: auto; word-wrap: break-word;" >' +
                    $(this).children().first().clone().html() + '</div>'; 
                // Hiển thị vễ phải
                _htmlAppendAnswer+='<div class="TrueFalseAnswerReview_ILBlock_Right">';
                if ($(this).children(':eq(1)').attr('status')=='1')
                {
                    _htmlAppendAnswer+='<div class="TrueFalseAnswerReview_ILBlock_Right_True"><img style="width:100%;height100%" src="images/button/Question/MultiChoiceChecked.png" > </div>';
                    _htmlAppendAnswer+='<div class="TrueFalseAnswerReview_ILBlock_Right_False"><img style="width:100%;height100%" src="images/button/Question/MultiChoice.png" ></div>';
                }else{
                    _htmlAppendAnswer+='<div class="TrueFalseAnswerReview_ILBlock_Right_True"><img style="width:100%;height100%" src="images/button/Question/MultiChoice.png" > </div>';
                    _htmlAppendAnswer+='<div class="TrueFalseAnswerReview_ILBlock_Right_False"><img style="width:100%;height100%" src="images/button/Question/FalseChecked.png" ></div>';
                }
                _htmlAppendAnswer+='</div>';
            }
            else if (_answered==1 && $(this).children(':eq(1)').attr('status')==_answered) // Trả lời đúng
            {
                // Lấy nội dung ra vế trái
                _htmlAppendAnswer+='<div class="TrueFalseAnswerReview_ILBlock_Left" style="border: 1px solid green; overflow-y: auto; word-wrap: break-word;" >' + 
                    $(this).children().first().clone().html() + '</div>';  
                // Hiển thị vễ phải
                _htmlAppendAnswer+='<div class="TrueFalseAnswerReview_ILBlock_Right">';
                _htmlAppendAnswer+='<div class="TrueFalseAnswerReview_ILBlock_Right_True"><img style="width:100%;height100%" src="images/button/Question/MultiChoiceChecked.png" > </div>';
                _htmlAppendAnswer+='<div class="TrueFalseAnswerReview_ILBlock_Right_False"><img style="width:100%;height100%" src="images/button/Question/MultiChoice.png" ></div>';
                _htmlAppendAnswer+='</div>';
            }
            else if (_answered==2 && $(this).children(':eq(1)').attr('status')=='0') // Trả lời đúng
            {
                // Lấy nội dung ra vế trái
                _htmlAppendAnswer+='<div class="TrueFalseAnswerReview_ILBlock_Left" style="border: 1px solid green; overflow-y: auto; word-wrap: break-word;" >' + 
                    $(this).children().first().clone().html() + '</div>';  
                // Hiển thị vễ phải
                _htmlAppendAnswer+='<div class="TrueFalseAnswerReview_ILBlock_Right">';
                _htmlAppendAnswer+='<div class="TrueFalseAnswerReview_ILBlock_Right_True"><img style="width:100%;height100%" src="images/button/Question/MultiChoice.png" > </div>';
                _htmlAppendAnswer+='<div class="TrueFalseAnswerReview_ILBlock_Right_False"><img style="width:100%;height100%" src="images/button/Question/FalseChecked.png" ></div>';
                _htmlAppendAnswer+='</div>';
            }else{
                // Lấy nội dung ra vế trái
                _htmlAppendAnswer+='<div class="TrueFalseAnswerReview_ILBlock_Left" style="border: 1px solid red; overflow-y: auto; word-wrap: break-word;" >' +
                    $(this).children().first().clone().html() + '</div>';
                // Hiển thị vễ phải
                _htmlAppendAnswer+='<div class="TrueFalseAnswerReview_ILBlock_Right">';
                if ($(this).children(':eq(1)').attr('status')=='1')
                {
                    _htmlAppendAnswer+='<div class="TrueFalseAnswerReview_ILBlock_Right_True"><img style="width:100%;height100%" src="images/button/Question/MultiChoiceChecked.png" > </div>';
                    _htmlAppendAnswer+='<div class="TrueFalseAnswerReview_ILBlock_Right_False"><img style="width:100%;height100%" src="images/button/Question/MultiChoice.png" ></div>';
                }else{
                    _htmlAppendAnswer+='<div class="TrueFalseAnswerReview_ILBlock_Right_True"><img style="width:100%;height100%" src="images/button/Question/MultiChoice.png" > </div>';
                    _htmlAppendAnswer+='<div class="TrueFalseAnswerReview_ILBlock_Right_False"><img style="width:100%;height100%" src="images/button/Question/FalseChecked.png" ></div>';
                }
                _htmlAppendAnswer+='</div>';
            }
            _htmlAppendAnswer+='</div>';
            if (_tempArr%2==0)
                _htmlAppendAnswer+='</div>';
        }
    });
    return _htmlAppendAnswer;
}
function TrueFalseQuesReviewQues(quesID)
{
    var _quesID=$('#' + quesID);
    var _htmlAppendQues='';
    var _htmlAppend;
    _quesID.children().each(function(){
        if ($(this).attr('id').indexOf('QuestionContent')>-1){
            _htmlAppend=$(this).clone();
            _htmlAppend.children().remove('svg');
            _htmlAppend.children().css('position','');
            _htmlAppend.children().css('line-height','1');
            _htmlAppendQues+='<div style="border:1px solid #000000; width: 96.5%;padding-left:2px; padding-right: 2px; margin-top: 2px; margin-bottom: 2px; margin-left: 0.5%; overflow-y: auto; display: block;">';
            if (typeof _htmlAppend.attr('id')!=typeof undefined){
                _htmlAppend.attr('id',_htmlAppend.attr('id')+'_Clone');
                _htmlAppend.children().each(function(){
                    if (typeof $(this).attr('id') != typeof undefined) $(this).attr('id',$(this).attr('id')+'_Clone');
                });
                _htmlAppend.children().children().each(function(){
                    if (typeof $(this).attr('id') != typeof undefined) $(this).attr('id',$(this).attr('id')+'_Clone');
                });
                _htmlAppend.children().children().children().each(function(){
                    if (typeof $(this).attr('id') != typeof undefined) $(this).attr('id',$(this).attr('id')+'_Clone');
                });
            }
            _htmlAppendQues+=_htmlAppend.html() + '</div>';
        }
    });
    return _htmlAppendQues;
}
// End of True false Question - Hết câu hỏi đúng sai
var listAmina_CELPage_276 = [{ StarTime: 0, EndTime: 35, NameFunction: "DiamondAnimate($('#CELPage_276'))",type: 0 } ];
var listObject = [{ page: 276, time: 42, listPage: listAmina_CELPage_276 }];
 $(document).ready(function(){
inlineTest($('#_f8c8cf9ad7a39d8434f1e71d3cec53f9_CELPage_276'), $('._f8c8cf9ad7a39d8434f1e71d3cec53f9_CELPage_276_1'));
$('#_f8c8cf9ad7a39d8434f1e71d3cec53f9_CELPage_276 > svg').css('display','none');
 });






















var listAmina_CELPage_428 = [{ StarTime: 0, EndTime: 0, NameFunction: "",type: 0 } ,{ StarTime: 1.28, EndTime: 2.28, NameFunction:"FlyInFormLeft($('#CTextFrame_1_5'))" ,type: 1 },{ StarTime: 5.08, EndTime: 6.08, NameFunction:"FlyInFormRight($('#CTextFrame_1_4'))" ,type: 1 }];
listObject.push({ page: 428, time: 14, listPage: listAmina_CELPage_428 })
 $(document).ready(function(){
inlineTest($('#_b59879932ead7392b5c8025e7dd3ede9_CELPage_428'), $('._b59879932ead7392b5c8025e7dd3ede9_CELPage_428_1'));
$('#_b59879932ead7392b5c8025e7dd3ede9_CELPage_428 > svg').css('display','none');
 });












var listAmina_CELPage_453 = [{ StarTime: 0, EndTime: 0, NameFunction: "",type: 0 } ];
listObject.push({ page: 453, time: 26, listPage: listAmina_CELPage_453 })
 $(document).ready(function(){
inlineTest($('#_b59879932ead7392b5c8025e7dd3ede9_CELPage_453'), $('._b59879932ead7392b5c8025e7dd3ede9_CELPage_453_1'));
$('#_b59879932ead7392b5c8025e7dd3ede9_CELPage_453 > svg').css('display','none');
 });






var listAmina_CELPage_257 = [{ StarTime: 0, EndTime: 2, NameFunction: "PushFromLeft($('#CELPage_257'),'-100%','0%',2000)",type: 0 } ,{ StarTime: 9.04, EndTime: 10.04, NameFunction:"FlyInFormLeft($('#CELGeometry_3_0'))" ,type: 1 },{ StarTime: 9.2, EndTime: 10.2, NameFunction:"FlyInFormLeft($('#CTextFrame_3_4'))" ,type: 1 },{ StarTime: 12.48, EndTime: 13.48, NameFunction:"FlyInFormLeft($('#CTextFrame_3_2'))" ,type: 1 },{ StarTime: 12.68, EndTime: 13.68, NameFunction:"FlyInFormLeft($('#CELGeometry_3_1'))" ,type: 1 }];
listObject.push({ page: 257, time: 18, listPage: listAmina_CELPage_257 })
 $(document).ready(function(){
inlineTest($('#_e08466d8cef538d03219f9000d5ba7a5_CELPage_257'), $('._e08466d8cef538d03219f9000d5ba7a5_CELPage_257_1'));
$('#_e08466d8cef538d03219f9000d5ba7a5_CELPage_257 > svg').css('display','none');
 });






$("#CTextFrame_3_4_Paragraph_0").prepend('<span class= "resizeText" size ="48" style = "font-size: 48px;font-family:"Times_New_Roman";  color: #000000;font-weight: bold; ">1.</span>');
var listAmina_CELPage_455 = [{ StarTime: 0, EndTime: 0, NameFunction: "",type: 0 } ,{ StarTime: 0.44, EndTime: 1.44, NameFunction:"FlyInFormTop($('#CTextFrame_4_0'))" ,type: 1 },{ StarTime: 1.72, EndTime: 2.72, NameFunction:"FlyInFormLeft($('#CTextFrame_4_2'))" ,type: 1 },{ StarTime: 18.72, EndTime: 19.72, NameFunction:"FlyInFormLeft($('#CTextFrame_4_1'))" ,type: 1 },{ StarTime: 34.64, EndTime: 37.64, NameFunction:"FlyInFormLeft($('#CTextFrame_4_3'))" ,type: 1 }];
listObject.push({ page: 455, time: 43, listPage: listAmina_CELPage_455 })
 $(document).ready(function(){
inlineTest($('#_2d191d2ae77b35119e549e140fb751c1_CELPage_455'), $('._2d191d2ae77b35119e549e140fb751c1_CELPage_455_1'));
$('#_2d191d2ae77b35119e549e140fb751c1_CELPage_455 > svg').css('display','none');
 });








var listAmina_CELPage_553 = [{ StarTime: 0, EndTime: 0, NameFunction: "",type: 0 } ,{ StarTime: 82.88, EndTime: 83.88, NameFunction:"FlyInFormRight($('#CELImage_5_1'))" ,type: 1 },{ StarTime: 101.2, EndTime: 102.2, NameFunction:"FlyInFormBottom($('#CELImage_5_0'))" ,type: 1 },{ StarTime: 109.92, EndTime: 110.92, NameFunction:"FlyInFormLeft($('#CELImage_5_2'))" ,type: 1 }];
listObject.push({ page: 553, time: 131, listPage: listAmina_CELPage_553 })
 $(document).ready(function(){
inlineTest($('#_7fcaf46435d6d0465ca88197f3ec38e4_CELPage_553'), $('._7fcaf46435d6d0465ca88197f3ec38e4_CELPage_553_1'));
$('#_7fcaf46435d6d0465ca88197f3ec38e4_CELPage_553 > svg').css('display','none');
 });








$("#CTextFrame_5_7_Paragraph_0").prepend('<span class= "resizeText" size ="48" style = "font-size: 48px;font-family:"Times_New_Roman";  color: #FF0000;font-weight: bold; ">1.</span>');


















 $(document).ready(function(){
inlineTest($('#_f8c8cf9ad7a39d8434f1e71d3cec53f9_CELQuestionPage_533'), $('._f8c8cf9ad7a39d8434f1e71d3cec53f9_CELQuestionPage_533_1'));
$('#_f8c8cf9ad7a39d8434f1e71d3cec53f9_CELQuestionPage_533 > svg').css('display','none');
 });
var listAmina_CELQuestionPage_533 = [{ StarTime: 0, EndTime: 0, NameFunction: "",type: 0 }];
listObject.push({ page: 533, time: 17, listPage: listAmina_CELQuestionPage_533 })
var _ansTrueCELQuestionPage_533='';
 $(document).ready(function(){
inlineTest($('#_f8c8cf9ad7a39d8434f1e71d3cec53f9_CELQuestionPage_536'), $('._f8c8cf9ad7a39d8434f1e71d3cec53f9_CELQuestionPage_536_1'));
$('#_f8c8cf9ad7a39d8434f1e71d3cec53f9_CELQuestionPage_536 > svg').css('display','none');
 });
var listAmina_CELQuestionPage_536 = [{ StarTime: 0, EndTime: 0, NameFunction: "",type: 0 }];
listObject.push({ page: 536, time: 32, listPage: listAmina_CELQuestionPage_536 })
var _ansTrueCELQuestionPage_536='';
var listAmina_CELPage_404 = [{ StarTime: 0, EndTime: 0, NameFunction: "",type: 0 } ,{ StarTime: 1.76, EndTime: 2.76, NameFunction:"FlyInFormLeft($('#CTextFrame_8_4'))" ,type: 1 },{ StarTime: 6.48, EndTime: 7.48, NameFunction:"FlyInFormLeft($('#CELImage_8_1'))" ,type: 1 },{ StarTime: 6.52, EndTime: 7.52, NameFunction:"FlyInFormLeft($('#CELImage_8_0'))" ,type: 1 },{ StarTime: 6.56, EndTime: 7.56, NameFunction:"FlyInFormLeft($('#CELImage_8_2'))" ,type: 1 },{ StarTime: 6.76, EndTime: 7.76, NameFunction:"FlyInFormLeft($('#CELImage_8_3'))" ,type: 1 },{ StarTime: 13.08, EndTime: 14.08, NameFunction:"FlyInFormTop($('#CTextFrame_8_5'))" ,type: 1 },{ StarTime: 14.48, EndTime: 15.48, NameFunction:"FlyInFormTop($('#CTextFrame_8_6'))" ,type: 1 },{ StarTime: 15.88, EndTime: 16.88, NameFunction:"FlyInFormBottomLeft($('#CTextFrame_8_7'))" ,type: 1 }];
listObject.push({ page: 404, time: 24, listPage: listAmina_CELPage_404 })
 $(document).ready(function(){
inlineTest($('#_18e3b32ee48f3c3aa0b7328ed95d488c_CELPage_404'), $('._18e3b32ee48f3c3aa0b7328ed95d488c_CELPage_404_1'));
$('#_18e3b32ee48f3c3aa0b7328ed95d488c_CELPage_404 > svg').css('display','none');
 });
















var listAmina_CELPage_546 = [{ StarTime: 0, EndTime: 2, NameFunction: "SplitHorizontalOut($('#CELPage_546'))",type: 0 } ,{ StarTime: 2.44, EndTime: 3.44, NameFunction:"FlyInFormLeft($('#CELImage_9_0'))" ,type: 1 },{ StarTime: 3.08, EndTime: 4.08, NameFunction:"FlyInFormLeft($('#CTextFrame_9_3'))" ,type: 1 }];
listObject.push({ page: 546, time: 11, listPage: listAmina_CELPage_546 })
 $(document).ready(function(){
inlineTest($('#_f8c8cf9ad7a39d8434f1e71d3cec53f9_CELPage_546'), $('._f8c8cf9ad7a39d8434f1e71d3cec53f9_CELPage_546_1'));
$('#_f8c8cf9ad7a39d8434f1e71d3cec53f9_CELPage_546 > svg').css('display','none');
 });








var listAmina_CELPage_547 = [{ StarTime: 0, EndTime: 0, NameFunction: "",type: 0 } ,{ StarTime: 0.0799999999999997, EndTime: 30.08, NameFunction:"TeeterObject($('#CELImage_10_2'))" ,type: 1 },{ StarTime: 10, EndTime: 10.5, NameFunction:"TeeterObject($('#CELImage_10_3'))" ,type: 1 },{ StarTime: 10.5, EndTime: 11, NameFunction:"TeeterObject($('#CELImage_10_3'))" ,type: 1 }];
listObject.push({ page: 547, time: 12, listPage: listAmina_CELPage_547 })
 $(document).ready(function(){
inlineTest($('#_f8c8cf9ad7a39d8434f1e71d3cec53f9_CELPage_547'), $('._f8c8cf9ad7a39d8434f1e71d3cec53f9_CELPage_547_1'));
$('#_f8c8cf9ad7a39d8434f1e71d3cec53f9_CELPage_547 > svg').css('display','none');
 });


















var listAmina_CELPage_554 = [{ StarTime: 0, EndTime: 0, NameFunction: "",type: 0 } ,{ StarTime: 10.16, EndTime: 11.16, NameFunction:"FlyInFormTop($('#CTextFrame_11_7'))" ,type: 1 },{ StarTime: 16.44, EndTime: 17.44, NameFunction:"FlyInFormRight($('#CTextFrame_11_15'))" ,type: 1 },{ StarTime: 18.28, EndTime: 19.28, NameFunction:"FlyInFormLeft($('#CTextFrame_11_14'))" ,type: 1 },{ StarTime: 20, EndTime: 21, NameFunction:"FlyInFormTop($('#CTextFrame_11_8'))" ,type: 1 },{ StarTime: 27.64, EndTime: 28.64, NameFunction:"FlyInFormLeft($('#CTextFrame_11_21'))" ,type: 1 },{ StarTime: 45.48, EndTime: 46.48, NameFunction:"FlyInFormLeft($('#CELImage_11_0'))" ,type: 1 },{ StarTime: 46.4, EndTime: 47.4, NameFunction:"FlyInFormLeft($('#CTextFrame_11_16'))" ,type: 1 },{ StarTime: 49.96, EndTime: 50.96, NameFunction:"FlyInFormLeft($('#CTextFrame_11_17'))" ,type: 1 },{ StarTime: 55.2, EndTime: 56.2, NameFunction:"FlyInFormLeft($('#CTextFrame_11_18'))" ,type: 1 }];
listObject.push({ page: 554, time: 65, listPage: listAmina_CELPage_554 })
 $(document).ready(function(){
inlineTest($('#_f8c8cf9ad7a39d8434f1e71d3cec53f9_CELPage_554'), $('._f8c8cf9ad7a39d8434f1e71d3cec53f9_CELPage_554_1'));
$('#_f8c8cf9ad7a39d8434f1e71d3cec53f9_CELPage_554 > svg').css('display','none');
 });
































var listAmina_CELPage_548 = [{ StarTime: 0, EndTime: 0, NameFunction: "",type: 0 } ,{ StarTime: 18.2, EndTime: 19.2, NameFunction:"FlyInFormTop($('#CTextFrame_12_7'))" ,type: 1 },{ StarTime: 20.08, EndTime: 21.08, NameFunction:"FlyInFormTop($('#CTextFrame_12_8'))" ,type: 1 },{ StarTime: 20.64, EndTime: 21.64, NameFunction:"FlyInFormTop($('#CELGeometry_12_1'))" ,type: 1 },{ StarTime: 21.32, EndTime: 22.32, NameFunction:"FlyInFormTop($('#CTextFrame_12_9'))" ,type: 1 },{ StarTime: 21.76, EndTime: 22.76, NameFunction:"FlyInFormTop($('#CELGeometry_12_6'))" ,type: 1 },{ StarTime: 22.2, EndTime: 23.2, NameFunction:"FlyInFormTop($('#CTextFrame_12_14'))" ,type: 1 },{ StarTime: 22.64, EndTime: 23.64, NameFunction:"FlyInFormTop($('#CELGeometry_12_5'))" ,type: 1 },{ StarTime: 25.48, EndTime: 26.48, NameFunction:"FlyInFormBottom($('#CTextFrame_12_11'))" ,type: 1 },{ StarTime: 27, EndTime: 28, NameFunction:"FlyInFormBottom($('#CELGeometry_12_4'))" ,type: 1 },{ StarTime: 27.44, EndTime: 28.44, NameFunction:"FlyInFormBottom($('#CTextFrame_12_12'))" ,type: 1 },{ StarTime: 27.88, EndTime: 28.88, NameFunction:"FlyInFormBottom($('#CELGeometry_12_2'))" ,type: 1 },{ StarTime: 28.32, EndTime: 29.32, NameFunction:"FlyInFormBottom($('#CTextFrame_12_13'))" ,type: 1 },{ StarTime: 28.76, EndTime: 29.76, NameFunction:"FlyInFormBottom($('#CTextFrame_12_10'))" ,type: 1 },{ StarTime: 29.32, EndTime: 30.32, NameFunction:"FlyInFormBottom($('#CELGeometry_12_3'))" ,type: 1 }];
listObject.push({ page: 548, time: 53, listPage: listAmina_CELPage_548 })
 $(document).ready(function(){
inlineTest($('#_f8c8cf9ad7a39d8434f1e71d3cec53f9_CELPage_548'), $('._f8c8cf9ad7a39d8434f1e71d3cec53f9_CELPage_548_1'));
$('#_f8c8cf9ad7a39d8434f1e71d3cec53f9_CELPage_548 > svg').css('display','none');
 });


















 $(document).ready(function(){
inlineTest($('#_f8c8cf9ad7a39d8434f1e71d3cec53f9_CELQuestionPage_565'), $('._f8c8cf9ad7a39d8434f1e71d3cec53f9_CELQuestionPage_565_1'));
$('#_f8c8cf9ad7a39d8434f1e71d3cec53f9_CELQuestionPage_565 > svg').css('display','none');
 });
var listAmina_CELQuestionPage_565 = [{ StarTime: 0, EndTime: 0, NameFunction: "",type: 0 }];
listObject.push({ page: 565, time: 17, listPage: listAmina_CELQuestionPage_565 })
var _ansTrueCELQuestionPage_565='radCheckAnswerContent_13_1,';
 $(document).ready(function(){
inlineTest($('#_f8c8cf9ad7a39d8434f1e71d3cec53f9_CELQuestionPage_567'), $('._f8c8cf9ad7a39d8434f1e71d3cec53f9_CELQuestionPage_567_1'));
$('#_f8c8cf9ad7a39d8434f1e71d3cec53f9_CELQuestionPage_567 > svg').css('display','none');
 });
var listAmina_CELQuestionPage_567 = [{ StarTime: 0, EndTime: 0, NameFunction: "",type: 0 }];
listObject.push({ page: 567, time: 17, listPage: listAmina_CELQuestionPage_567 })
var _ansTrueCELQuestionPage_567='radCheckAnswerContent_14_3,';
 $(document).ready(function(){
inlineTest($('#_f8c8cf9ad7a39d8434f1e71d3cec53f9_CELQuestionPage_569'), $('._f8c8cf9ad7a39d8434f1e71d3cec53f9_CELQuestionPage_569_1'));
$('#_f8c8cf9ad7a39d8434f1e71d3cec53f9_CELQuestionPage_569 > svg').css('display','none');
 });
var listAmina_CELQuestionPage_569 = [{ StarTime: 0, EndTime: 0, NameFunction: "",type: 0 }];
listObject.push({ page: 569, time: 17, listPage: listAmina_CELQuestionPage_569 })
 $(document).ready(function(){
inlineTest($('#_f8c8cf9ad7a39d8434f1e71d3cec53f9_CELQuestionPage_571'), $('._f8c8cf9ad7a39d8434f1e71d3cec53f9_CELQuestionPage_571_1'));
$('#_f8c8cf9ad7a39d8434f1e71d3cec53f9_CELQuestionPage_571 > svg').css('display','none');
 });
var listAmina_CELQuestionPage_571 = [{ StarTime: 0, EndTime: 0, NameFunction: "",type: 0 }];
listObject.push({ page: 571, time: 32, listPage: listAmina_CELQuestionPage_571 })
var _ansTrueCELQuestionPage_571='LUYỆN TẬPCâu 1-SGK: Các sự kiện dưới đây cách ngày nay bao nhiêu năm?Hướng dẫn: Hãy kích chọn câu hỏi phía trái rồi giữ chuột đưa ghép với đáp án đúng phía phải, rồi kích chuột vào phần &quot;xác nhận câu trả lời&quot;';
 $(document).ready(function(){
inlineTest($('#_f8c8cf9ad7a39d8434f1e71d3cec53f9_CELQuestionPage_574'), $('._f8c8cf9ad7a39d8434f1e71d3cec53f9_CELQuestionPage_574_1'));
$('#_f8c8cf9ad7a39d8434f1e71d3cec53f9_CELQuestionPage_574 > svg').css('display','none');
 });
var listAmina_CELQuestionPage_574 = [{ StarTime: 0, EndTime: 0, NameFunction: "",type: 0 }];
listObject.push({ page: 574, time: 62, listPage: listAmina_CELQuestionPage_574 })
var _ansTrueCELQuestionPage_574='';
var listAmina_CELPage_570 = [{ StarTime: 0, EndTime: 0, NameFunction: "",type: 0 } ];
listObject.push({ page: 570, time: 29, listPage: listAmina_CELPage_570 })
 $(document).ready(function(){
inlineTest($('#_b59879932ead7392b5c8025e7dd3ede9_CELPage_570'), $('._b59879932ead7392b5c8025e7dd3ede9_CELPage_570_1'));
$('#_b59879932ead7392b5c8025e7dd3ede9_CELPage_570 > svg').css('display','none');
 });








var listAmina_CELPage_302 = [{ StarTime: 0, EndTime: 0, NameFunction: "",type: 0 } ];
listObject.push({ page: 302, time: 14, listPage: listAmina_CELPage_302 })
 $(document).ready(function(){
inlineTest($('#_f8c8cf9ad7a39d8434f1e71d3cec53f9_CELPage_302'), $('._f8c8cf9ad7a39d8434f1e71d3cec53f9_CELPage_302_1'));
$('#_f8c8cf9ad7a39d8434f1e71d3cec53f9_CELPage_302 > svg').css('display','none');
 });








function ResizeBorderAndText() {
    var hContainer = $('#leftMainContent').height();
    $('.resizeFrame').each(function(){
        var _idFrame = $(this).attr('id');
        var wBorder = $(this).attr('size')*hContainer/800;
        $(this).css('border-width', wBorder + 'px');
        var max = 0;$('span','#'+_idFrame).each(function(){
            var num = $(this).attr('size');if (num>max) {max=num;}
        });
        if(max != 0){
            $('.resizeText').each(function(){
                var lineHeight = (max * hContainer)/800;
                $('#'+_idFrame).css('line-height', lineHeight + 'px');
                var textSize = $(this).attr('size'); 
                var newTSize = (textSize * hContainer)/800;
                $(this).css('font-size',newTSize + 'px');
            })
        }
    $('.svgFrame').each(function()
    {
        var _wFrame = $(this).attr('wFrame')*12.8*hContainer/800;
        var _hFrame = $(this).attr('hFrame')*8*hContainer/800;
        var _wBorder = $(this).attr('borderwidth')*hContainer/800;
        $(this).children('path').attr('d','M 0 0 L '+ _wFrame + ' 0 L ' + _wFrame + ' ' + _hFrame + ' L 0 '+_hFrame +' L 0 0');
        $(this).children('path').attr('stroke-width', _wBorder +'px');
        var dashArray = [];
        for (var i = 0; i< ($(this).attr('strokedash')).length; i++) {
            dashArray.push($(this).attr('strokedash')[i]*_wBorder);
        }
        $(this).children('path').attr('stroke', $(this).attr('bordercolor'));
        $(this).children('path').attr('stroke-dasharray',dashArray);
        $(this).children('path').attr('fill',$(this).attr('backgroundcolor'));
        })
    });
    $('.underlineAns').each(function(){
        var _underFontSize=parseFloat($(this).css('font-size'));
        var _underFontSize1=parseFloat($(this).parent().children().first().css('font-size'));
        $(this).css('top',(_underFontSize + _underFontSize1) + 'px');
        $(this).parent().parent().css('line-height',(_underFontSize + _underFontSize1) + 'px');
    });
    $('p').each(function(){if (typeof $(this).attr('id')!=typeof undefined){var _fontSize=parseFloat($(this).children().first().css('font-size'))*0.1;$(this).css('margin', _fontSize + 'px ' +  _fontSize + 'px');}});
}
var timer = null;var MaxTime = 0;var stepFrame = 0.0;var value = 0;var nubmerPage = 0;var step = 100;
MaxTime = listObject[nubmerPage].time;
$('#slider_Cpage_0').slider({
    value: stepFrame,
    min: 0,
    max: MaxTime,
    slide: function (event, ui) {
        $('#slider-value').html(ui.value);
        stopTime();
        stop();
        PercentPage(ui.value, true);
        SetDemonstrationTime();
    },
    stop: function( event, ui ) {
        $('#slider-value').html(ui.value);
        stepFrame = ui.value;nubmerPage = checkNumberPage();var list = listObject[nubmerPage];var listPage = list.listPage;
        if($('#mainBottomBtnPlayPause').css('display')=='none'){
            stopTime();
        }else{
            stopTime();timer = null;PercentPage(ui.value, false);
        }
    }
});
$('#slider-value').html($('#slider_Cpage_0').slider('option', 'value'));
function init(){
    if (typeof InitWithLMS !== 'undefined' && $.isFunction(InitWithLMS)) InitWithLMS();
    $('#loadingPage').parent().css('visibility','hidden');
    $('#mainBottomBtnPV').addClass('hidden');
    $('#mainBottomBtnPVDisable').show();
    ($('#leftMainContent').find('.CELPage')).each(function(index){if(index!=0){var id=$(this).find('object');$(id).css('display','none');}});
    setTimeout(startTime, 800);
};