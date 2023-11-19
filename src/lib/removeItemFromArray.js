const arrayRemoveItem = (arr, id) => {
    if (arr && id) {
        return arr.filter(function (item) {
            return item.id != id;
        });
    }
    return [];
}

export default arrayRemoveItem;