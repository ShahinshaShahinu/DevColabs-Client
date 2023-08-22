export const ProfileValidation = (userData: { FirstName: string, LastName: string, Pronouns: string, Headline: string, Hashtags: string, AboutMe: string }) => {
    try {
        const regex = {
            lnameRgx: /^(?! +$)[A-Za-z ]{3,30}$/,
            emailRgx: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            passWordRgx: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            HeadlineRgx: /^(?!\s+$)[A-Za-z\d\s]{10,}$/,
            AboutMeReg: /^(?!\s+$)[\s\S]{10,250}$/
        };

        const { FirstName, LastName, Pronouns, Headline, Hashtags, AboutMe } = userData;


        console.log('coming the validatoin');




        const errors = {
            FirstName: "",
            LastName: "",
            Headline: '',
            Hashtags: '',
            Pronouns: 'Please select',
            AboutMe: ''
        };

        if (!regex.lnameRgx.test(FirstName)) {
            return errors.FirstName = "Enter a valid FirstName, Minimum 3 character  ";
        }

        else if (!regex.lnameRgx.test(LastName)) {
            return errors.LastName = "Enter a valid LastName Minimum 3 character";
        } else if (Pronouns === 'Please select') {
            return errors.Pronouns = "Please select Pronouns";
        } else if (!regex.HeadlineRgx.test(Headline)) {
            return errors.Headline = "Enter A valid Headline Minimum 10 letters";
        } else if (Hashtags === 'Please select') {
            return errors.Hashtags = "Enter A valid Hashtags";
        }
        
        else if (!regex.AboutMeReg.test(AboutMe)) {
            console.log('minimum');

            return errors.AboutMe = 'Enter About Me  Minimum 10 letters'
        }
        console.log('returnnnnnn');

        return 'success'
    } catch (error) {
        console.log(error);

    }



};