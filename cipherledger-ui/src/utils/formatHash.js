export function formatHash(hash) {


    if (!hash)

        return "";


    return hash.substring(0, 12)
        +
        "...";


}