export default interface HandlerResponse {
  statusCode: number;
  message: string;
  data?: any;
  success: boolean;
}
