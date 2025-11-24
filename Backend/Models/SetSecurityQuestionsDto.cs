using System.Collections.Generic;

namespace InternAttendenceSystem.Models
{
    public class SetSecurityQuestionsDto
    {
        public List<SecurityQuestionAnswerDto> Questions { get; set; }
    }

    public class SecurityQuestionAnswerDto
    {
        public string Question { get; set; }
        public string Answer { get; set; }
    }
}