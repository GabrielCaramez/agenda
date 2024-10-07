package com.example.agenda;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import javassist.bytecode.stackmap.BasicBlock.Catch;
import net.bytebuddy.asm.Advice.Return;
/**
 * conexao
 */

public class conexao {
    private static final String URL = "jdbc:mysql://localhost:3306/agenda_db";
    private static final String USER = "root";
    private static final String PASSWORD= "";

    private static Connection conn;

    public static Connection getConexao() {
        if(conn == null){
            conn = DriverManager.getConnection(URL, USER, PASSWORD);
            return conn;
        }else{
            return conn;


        }
    }Catch(SQLException e){
        e.printStackTrace();
        return null;
    }
}
