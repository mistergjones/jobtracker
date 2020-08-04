let deleteButtons = document.querySelectorAll('.delete-btn');
const handleDeleteButton = function myConfirm() {
    var result = confirm("Confirm to delete?");
    if (result == true) {
        return true;
    } else {
        return false;
    }
}

deleteButtons.forEach(deleteButton => {
    deleteButton.addEventListener('click', handleDeleteButton);
})