export function getUrlParam(urlParams:any[], parameterName:string) {
    let param;
    if (urlParams !== undefined && urlParams.length !== 0) {
        param = urlParams.find((f: any) => f.parameterName === parameterName)
    }
    return param ? param.parameterValue : undefined
}