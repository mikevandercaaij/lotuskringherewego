function validate(sesFirstName, sesLastName, sesEmailAddress, sesPhoneNumber, sesStreet, sesHouseNumber, sesHouseNumberAddition, sesPostalCode, sesTown) {
    let firstName = document.getElementById("firstName");
    let lastName = document.getElementById("lastName");
    let emailAddress = document.getElementById("emailAddress");
    let phoneNumber = document.getElementById("phoneNumber");
    let street = document.getElementById("street");
    let houseNumber = document.getElementById("houseNumber");
    let houseNumberAddition = document.getElementById("houseNumberAddition");
    let postalCode = document.getElementById("postalCode");
    let town = document.getElementById("town");
    let streetValue = document.getElementById("street").value;
    let houseNumberValue = document.getElementById("houseNumber").value;
    let houseNumberAdditionValue = document.getElementById("houseNumberAddition").value;
    let postalCodeValue = document.getElementById("postalCode").value;
    let townValue = document.getElementById("town").value;

    let playgroundStreet = document.getElementById("playgroundStreet");
    let playgroundHouseNumber = document.getElementById("playgroundHouseNumber");
    let playgroundHouseNumberAddition = document.getElementById("playgroundHouseNumberAddition");
    let playgroundPostalCode = document.getElementById("playgroundPostalCode");
    let playgroundTown = document.getElementById("playgroundTown");
    let playgroundStreetValue = document.getElementById("playgroundStreet").value;
    let playgroundHouseNumberValue = document.getElementById("playgroundHouseNumber").value;
    let playgroundHouseNumberAdditionValue = document.getElementById("playgroundHouseNumberAddition").value;
    let playgroundPostalCodeValue = document.getElementById("playgroundPostalCode").value;
    let playgroundTownValue = document.getElementById("playgroundTown").value;

    let makeUpStreet = document.getElementById("makeUpStreet");
    let makeUpHouseNumber = document.getElementById("makeUpHouseNumber");
    let makeUpHouseNumberAddition = document.getElementById("makeUpHouseNumberAddition");
    let makeUpPostalCode = document.getElementById("makeUpPostalCode");
    let makeUpTown = document.getElementById("makeUpTown");

    if (document.getElementById("checkedOrNotProfile").checked) {
        if (sesFirstName !== "") {
            firstName.setAttribute("value", sesFirstName);
            firstName.setAttribute("readonly", true);
        }
        if (sesLastName !== "") {
            lastName.setAttribute("value", sesLastName);
            lastName.setAttribute("readonly", true);
        }
        if (sesEmailAddress !== "") {
            emailAddress.setAttribute("value", sesEmailAddress);
            emailAddress.setAttribute("readonly", true);
        }
        if (sesPhoneNumber !== "") {
            phoneNumber.setAttribute("value", sesPhoneNumber);
            phoneNumber.setAttribute("readonly", true);
        }
        if (sesStreet !== "") {
            street.setAttribute("value", sesStreet);
            street.setAttribute("readonly", true);
        }
        if (sesHouseNumber !== "") {
            houseNumber.setAttribute("value", sesHouseNumber);
            houseNumber.setAttribute("readonly", true);
        }
        if (sesHouseNumberAddition !== "") {
            houseNumberAddition.setAttribute("value", sesHouseNumberAddition);
            houseNumberAddition.setAttribute("readonly", true);
        }
        if (sesPostalCode !== "") {
            postalCode.setAttribute("value", sesPostalCode);
            postalCode.setAttribute("readonly", true);
        }
        if (sesTown !== "") {
            town.setAttribute("value", sesTown);
            town.setAttribute("readonly", true);
        }
    } else {
        firstName.removeAttribute("value");
        lastName.removeAttribute("value");
        emailAddress.removeAttribute("value");
        phoneNumber.removeAttribute("value");
        street.removeAttribute("value");
        houseNumber.removeAttribute("value");
        houseNumberAddition.removeAttribute("value");
        postalCode.removeAttribute("value");
        town.removeAttribute("value");

        firstName.removeAttribute("readonly");
        lastName.removeAttribute("readonly");
        emailAddress.removeAttribute("readonly");
        phoneNumber.removeAttribute("readonly");
        street.removeAttribute("readonly");
        houseNumber.removeAttribute("readonly");
        houseNumberAddition.removeAttribute("readonly");
        postalCode.removeAttribute("readonly");
        town.removeAttribute("readonly");

        if (document.getElementById("checkedOrNotPlayground").checked && playgroundStreetValue == streetValue && playgroundHouseNumberValue == houseNumberValue && playgroundHouseNumberAdditionValue == houseNumberAdditionValue && playgroundPostalCodeValue == postalCodeValue && playgroundTownValue == townValue) {
            document.getElementById("checkedOrNotPlayground").checked = false;
            playgroundStreet.removeAttribute("value");
            playgroundHouseNumber.removeAttribute("value");
            playgroundHouseNumberAddition.removeAttribute("value");
            playgroundPostalCode.removeAttribute("value");
            playgroundTown.removeAttribute("value");

            playgroundStreet.removeAttribute("readonly");
            playgroundHouseNumber.removeAttribute("readonly");
            playgroundHouseNumberAddition.removeAttribute("readonly");
            playgroundPostalCode.removeAttribute("readonly");
            playgroundTown.removeAttribute("readonly");
        }

        if (document.getElementById("checkedOrNotMakeUp").checked && playgroundStreetValue == makeUpStreet.value && playgroundHouseNumberValue == makeUpHouseNumber.value && playgroundHouseNumberAdditionValue == makeUpHouseNumberAddition.value && playgroundPostalCodeValue == makeUpPostalCode.value && playgroundTownValue == makeUpTown.value) {
            document.getElementById("checkedOrNotMakeUp").checked = false;
            makeUpStreet.removeAttribute("value");
            makeUpHouseNumber.removeAttribute("value");
            makeUpHouseNumberAddition.removeAttribute("value");
            makeUpPostalCode.removeAttribute("value");
            makeUpTown.removeAttribute("value");

            makeUpStreet.removeAttribute("readonly");
            makeUpHouseNumber.removeAttribute("readonly");
            makeUpHouseNumberAddition.removeAttribute("readonly");
            makeUpPostalCode.removeAttribute("readonly");
            makeUpTown.removeAttribute("readonly");
        }
    }

    if (document.getElementById("checkedOrNotPlayground").checked) {
        if (streetValue !== "" && houseNumberValue !== "" && postalCodeValue !== "" && townValue !== "") {
            firstName.setAttribute("readonly", true);
            lastName.setAttribute("readonly", true);
            emailAddress.setAttribute("readonly", true);
            phoneNumber.setAttribute("readonly", true);
            street.setAttribute("readonly", true);
            houseNumber.setAttribute("readonly", true);
            houseNumberAddition.setAttribute("readonly", true);
            postalCode.setAttribute("readonly", true);
            town.setAttribute("readonly", true);

            playgroundStreet.setAttribute("value", streetValue);
            playgroundHouseNumber.setAttribute("value", houseNumberValue);
            playgroundHouseNumberAddition.setAttribute("value", houseNumberAdditionValue);
            playgroundPostalCode.setAttribute("value", postalCodeValue);
            playgroundTown.setAttribute("value", townValue);

            playgroundStreet.setAttribute("readonly", true);
            playgroundHouseNumber.setAttribute("readonly", true);
            playgroundHouseNumberAddition.setAttribute("readonly", true);
            playgroundPostalCode.setAttribute("readonly", true);
            playgroundTown.setAttribute("readonly", true);
        } else {
            document.getElementById("checkedOrNotPlayground").checked = false;
        }
    } else {
        playgroundStreet.removeAttribute("value");
        playgroundHouseNumber.removeAttribute("value");
        playgroundHouseNumberAddition.removeAttribute("value");
        playgroundPostalCode.removeAttribute("value");
        playgroundTown.removeAttribute("value");

        playgroundStreet.removeAttribute("readonly");
        playgroundHouseNumber.removeAttribute("readonly");
        playgroundHouseNumberAddition.removeAttribute("readonly");
        playgroundPostalCode.removeAttribute("readonly");
        playgroundTown.removeAttribute("readonly");

        if (document.getElementById("checkedOrNotMakeUp").checked && playgroundStreetValue == makeUpStreet.value && playgroundHouseNumberValue == makeUpHouseNumber.value && playgroundHouseNumberAdditionValue == makeUpHouseNumberAddition.value && playgroundPostalCodeValue == makeUpPostalCode.value && playgroundTownValue == makeUpTown.value) {
            document.getElementById("checkedOrNotMakeUp").checked = false;
            makeUpStreet.removeAttribute("value");
            makeUpHouseNumber.removeAttribute("value");
            makeUpHouseNumberAddition.removeAttribute("value");
            makeUpPostalCode.removeAttribute("value");
            makeUpTown.removeAttribute("value");
        }
    }

    if (document.getElementById("checkedOrNotMakeUp").checked) {
        if (playgroundStreetValue !== "" && playgroundHouseNumberValue !== "" && playgroundPostalCodeValue !== "" && playgroundTownValue !== "") {
            if (document.getElementById("checkedOrNotPlayground").checked == false) {
                document.getElementById("checkedOrNotPlayground").disabled = true;
            }
            playgroundStreet.setAttribute("readonly", true);
            playgroundHouseNumber.setAttribute("readonly", true);
            playgroundHouseNumberAddition.setAttribute("readonly", true);
            playgroundPostalCode.setAttribute("readonly", true);
            playgroundTown.setAttribute("readonly", true);

            makeUpStreet.setAttribute("value", playgroundStreetValue);
            makeUpHouseNumber.setAttribute("value", playgroundHouseNumberValue);
            makeUpHouseNumberAddition.setAttribute("value", playgroundHouseNumberAdditionValue);
            makeUpPostalCode.setAttribute("value", playgroundPostalCodeValue);
            makeUpTown.setAttribute("value", playgroundTownValue);

            makeUpStreet.setAttribute("readonly", true);
            makeUpHouseNumber.setAttribute("readonly", true);
            makeUpHouseNumberAddition.setAttribute("readonly", true);
            makeUpPostalCode.setAttribute("readonly", true);
            makeUpTown.setAttribute("readonly", true);
        } else {
            document.getElementById("checkedOrNotMakeUp").checked = false;
        }
    } else {
        document.getElementById("checkedOrNotPlayground").disabled = false;
        makeUpStreet.removeAttribute("value");
        makeUpHouseNumber.removeAttribute("value");
        makeUpHouseNumberAddition.removeAttribute("value");
        makeUpPostalCode.removeAttribute("value");
        makeUpTown.removeAttribute("value");

        makeUpStreet.removeAttribute("readonly");
        makeUpHouseNumber.removeAttribute("readonly");
        makeUpHouseNumberAddition.removeAttribute("readonly");
        makeUpPostalCode.removeAttribute("readonly");
        makeUpTown.removeAttribute("readonly");
    }
}
