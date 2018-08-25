export interface ICustomCommand {
	id: string;
	serverId: string;
	commandText: string;
	commandType: string;
	imageUrl?: string;
	commandResponse?: string;
	createDate: string;
	createUser: string;
}
