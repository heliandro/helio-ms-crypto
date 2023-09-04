import { LogColor } from "../utils/enum/LogColor.enum";

const MENU_UI = `${LogColor.GREEN}
Selecione uma opção abaixo:

generate        | Gerar um par de chaves
get             | Ler uma chave. Ex: > get public | > get private
encrypt         | Criptografa um dado. Ex: > encrypt "{ nome: 'fulano' }"
decrypt         | Desencriptografa um dado. Ex: > decrypt XptoRSsdsdsadasdsaasdasdVQ=
close           | Encerrar o CLI

Digite opção desejada:
${LogColor.RESET}`;

export const MenuComponent = () => {

    console.log(MENU_UI);
}