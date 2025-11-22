USE DicriEvidenciasDB;
GO

-- 1. Guardar un Refresh Token al hacer Login
CREATE OR ALTER PROCEDURE sp_RefreshTokens_Guardar
    @IdUsuario INT,
    @Token NVARCHAR(500),
    @FechaExpiracion DATETIME2
AS
BEGIN
    INSERT INTO RefreshTokens (IdUsuario, Token, FechaCreacion, FechaExpiracion, Revocado)
    VALUES (@IdUsuario, @Token, SYSDATETIME(), @FechaExpiracion, 0);
END
GO

-- 2. Buscar un Refresh Token (para validar si existe y es válido)
CREATE OR ALTER PROCEDURE sp_RefreshTokens_Obtener
    @Token NVARCHAR(500)
AS
BEGIN
    SELECT IdRefreshToken, IdUsuario, Token, FechaExpiracion, Revocado
    FROM RefreshTokens
    WHERE Token = @Token;
END
GO

-- 3. Revocar Token (Logout)
CREATE OR ALTER PROCEDURE sp_RefreshTokens_Revocar
    @Token NVARCHAR(500)
AS
BEGIN
    UPDATE RefreshTokens
    SET Revocado = 1
    WHERE Token = @Token;
END
GO
