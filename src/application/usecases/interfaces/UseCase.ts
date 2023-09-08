export default interface UseCase {

    execute(data?: any): Promise<any>;
}