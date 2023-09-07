export interface UseCase {

    execute(data?: any): Promise<any>;
}