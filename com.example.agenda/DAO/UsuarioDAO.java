package com.example.agenda.DAO;
import entity.Usuario;

public class UsuarioDAO {
    public void cadastrarUsuario(Usuario usuario) {
        String sql="INSERT INTO usuario (nome, date, time, notes) VALUES (?,?,?,?)";
        try{
            ps = conexao.getConexao().prepareStatement(sql);
            ps.setString(parameterIndex: 1, usuario.getNome());
            ps.setInt(parameterIndex: 2, usuario.getDate());
            ps.setInt(parameterIndex: 3, usuario.getTime());
            ps.setString(parameterIndex: 4, usuario.getNotes());
            ps.execute();
            ps.close()

        }catch(SQLException e){
            e.printStackTrace();
        }
    
}
}