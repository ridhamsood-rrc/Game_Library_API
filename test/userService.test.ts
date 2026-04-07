import { userModel } from '../src/api/v1/models/userModel';
import * as userService from '../src/api/v1/services/userService';
import * as repositoryModule from '../src/api/v1/repository/userFirestoreRepository';

// Mock the repository module
jest.mock('../src/api/v1/repository/firestoreRepository');

const mockUser: userModel = {
    username: "Prachi",
    password: "Prachi13",
    DOB: "2012-02-13",
    platform: ["PC"],
    createdAt: "20226-02-02"
}

describe('serviceMethod', () => {
    it('should get users successfully', async () => {
        // Arrange
        (repositoryModule.getAllUsers as jest.Mock).mockResolvedValue(mockUser);

        // Act
        const result = await userService.getAllUsers();

        // Assert
        expect(repositoryModule.getAllUsers).toHaveBeenCalledTimes(1);
        expect(result).toEqual(mockUser);
    });

    it("should create user successfully", async() => {
        // Arrange
        (repositoryModule.createUsers as jest.Mock).mockResolvedValue(mockUser);

        // Act
        const result = await userService.createUsers(mockUser);

        // Assert
        expect(repositoryModule.createUsers).toHaveBeenCalledTimes(1);
        expect(result).toEqual(mockUser);
    });

    it("should update user successfully", async() => {
        // Arrange
        const data = { username: "Prachi Dhamija"};
        const user = { ...mockUser, ...data};

        (repositoryModule.updateUser as jest.Mock).mockResolvedValue(user);

        // Act
        const result: userModel = await userService.updateUser("user00001", data);

        // Assert
        expect(repositoryModule.updateUser).toHaveBeenCalledWith("user00001", data);
        expect(result.username).toBe("Prachi Dhamija");
    });

    it("should get user by id successfully", async() => {
        // Arrange
        (repositoryModule.getUserById as jest.Mock).mockResolvedValue(mockUser);

        // Act
        const result = await userService.getUserById("user00001");

        // Assert
        expect(repositoryModule.getUserById).toHaveBeenCalledWith("user00001");
        expect(result).toBe(mockUser);
    });

    it("should delete user successfully", async() => {
        // Arrange
        (repositoryModule.deleteUser as jest.Mock).mockResolvedValue(true);

        // Act
        const result = await userService.deleteUser("user00001");

        // Assert
        expect(repositoryModule.deleteUser).toHaveBeenCalledWith("user00001");
        expect(result).toBe(true);
    });
});